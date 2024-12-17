"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo trigger để cập nhật số lượt xem của truyện khi có chapter mới được xem
    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_comic_views_after_chapter_update
      AFTER UPDATE ON chapters
      FOR EACH ROW
      BEGIN
        DECLARE total_views INT;
    
        SELECT SUM(views) INTO total_views
        FROM chapters
        WHERE comic_id = NEW.comic_id;
    
        UPDATE comics
        SET views = total_views
        WHERE id = NEW.comic_id;
      END;
    `);

    // Tạo trigger để cập nhật đánh giá trung bình của truyện khi có đánh giá mới hoặc đánh giá bị xóa
    await queryInterface.sequelize.query(`
      CREATE TRIGGER insert_comic_average_rating
      AFTER INSERT ON rating_comics_users
      FOR EACH ROW
      BEGIN
        DECLARE total_rating DECIMAL(10, 2);
        DECLARE rating_count INT;
        DECLARE average_rating DECIMAL(10, 2);
    
        SELECT SUM(rating), COUNT(*) INTO total_rating, rating_count
        FROM rating_comics_users
        WHERE comic_id = NEW.comic_id;
    
        IF rating_count = 0 THEN
          SET average_rating = 0;
        ELSE
          SET average_rating = ROUND(COALESCE(total_rating, 0) / rating_count, 2);
        END IF;
    
        UPDATE comics
        SET rating = average_rating
        WHERE id = NEW.comic_id;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_comic_average_rating
      AFTER UPDATE ON rating_comics_users
      FOR EACH ROW
      BEGIN
        DECLARE total_rating DECIMAL(10, 2);
        DECLARE rating_count INT;
        DECLARE average_rating DECIMAL(10, 2);
    
        SELECT SUM(rating), COUNT(*) INTO total_rating, rating_count
        FROM rating_comics_users
        WHERE comic_id = NEW.comic_id;
    
        IF rating_count = 0 THEN
          SET average_rating = 0;
        ELSE
          SET average_rating = ROUND(COALESCE(total_rating, 0) / rating_count, 2);
        END IF;
    
        UPDATE comics
        SET rating = average_rating
        WHERE id = NEW.comic_id;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER delete_comic_average_rating
      AFTER DELETE ON rating_comics_users
      FOR EACH ROW
      BEGIN
        DECLARE total_rating DECIMAL(10, 2);
        DECLARE rating_count INT;
        DECLARE average_rating DECIMAL(10, 2);
    
        SELECT SUM(rating), COUNT(*) INTO total_rating, rating_count
        FROM rating_comics_users
        WHERE comic_id = OLD.comic_id;
    
        IF rating_count = 0 THEN
          SET average_rating = 0;
        ELSE
          SET average_rating = ROUND(COALESCE(total_rating, 0) / rating_count, 2);
        END IF;
    
        UPDATE comics
        SET rating = average_rating
        WHERE id = OLD.comic_id;
      END;
    `);

    // Tạo trigger để cập nhật số lượt bookmark của truyện khi có bookmark mới hoặc bookmark bị xóa
    await queryInterface.sequelize.query(`
      CREATE TRIGGER insert_comic_bookmark_count
      AFTER INSERT ON bookmark_comics_users
      FOR EACH ROW
      BEGIN
        DECLARE total_bookmarks INT;

        SELECT COUNT(*) INTO total_bookmarks
        FROM bookmark_comics_users
        WHERE comic_id = NEW.comic_id;

        UPDATE comics
        SET bookmarks = total_bookmarks
        WHERE id = NEW.comic_id;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER delete_comic_bookmark_count
      AFTER DELETE ON bookmark_comics_users
      FOR EACH ROW
      BEGIN
        DECLARE total_bookmarks INT;

        SELECT COUNT(*) INTO total_bookmarks
        FROM bookmark_comics_users
        WHERE comic_id = OLD.comic_id;

        UPDATE comics
        SET bookmarks = total_bookmarks
        WHERE id = OLD.comic_id;
      END;
    `);

    // Tạo trigger để cập nhật số comments của truyện khi có comment mới
    await queryInterface.sequelize.query(`
      CREATE TRIGGER insert_comic_comment_count
      AFTER INSERT ON comments
      FOR EACH ROW
      BEGIN
        DECLARE total_comments INT;

        SELECT COUNT(*) INTO total_comments
        FROM comments
        WHERE comic_id = NEW.comic_id;

        UPDATE comics
        SET comments = total_comments
        WHERE id = NEW.comic_id;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER delete_comic_comment_count
      AFTER DELETE ON comments
      FOR EACH ROW
      BEGIN
        DECLARE total_comments INT;

        SELECT COUNT(*) INTO total_comments
        FROM comments
        WHERE comic_id = OLD.comic_id;

        UPDATE comics
        SET comments = total_comments
        WHERE id = OLD.comic_id;
      END;
    `);

    // Tạo trigger để cập nhật số lượng chapter của truyện khi có chapter mới hoặc chapter bị xóa
    await queryInterface.sequelize.query(`
      CREATE TRIGGER insert_comic_chapter_count
      AFTER INSERT ON chapters
      FOR EACH ROW
      BEGIN
        DECLARE total_chapters INT;

        SELECT COUNT(*) INTO total_chapters
        FROM chapters
        WHERE comic_id = NEW.comic_id;

        UPDATE comics
        SET number_of_chapters = total_chapters
        WHERE id = NEW.comic_id;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER delete_comic_chapter_count
      AFTER DELETE ON chapters
      FOR EACH ROW
      BEGIN
        DECLARE total_chapters INT;

        SELECT COUNT(*) INTO total_chapters
        FROM chapters
        WHERE comic_id = OLD.comic_id;

        UPDATE comics
        SET number_of_chapters = total_chapters
        WHERE id = OLD.comic_id;
      END;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS update_comic_views_after_chapter_update"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS insert_comic_average_rating"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS update_comic_average_rating"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS delete_comic_average_rating"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS insert_comic_bookmark_count"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS delete_comic_bookmark_count"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS insert_comic_comment_count"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS delete_comic_comment_count"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS insert_comic_chapter_count"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER IF EXISTS delete_comic_chapter_count"
    );
  },
};
