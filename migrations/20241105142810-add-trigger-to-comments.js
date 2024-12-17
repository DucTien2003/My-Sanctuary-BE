"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Trigger để đồng bộ lại likes và dislikes sau khi thêm, xóa hoặc cập nhật
    await queryInterface.sequelize.query(`
      CREATE TRIGGER insert_comment_likes_dislikes
      AFTER INSERT ON like_dislike_comments
      FOR EACH ROW
      BEGIN
        DECLARE total_likes INT;
        DECLARE total_dislikes INT;

        SELECT COUNT(*) INTO total_likes
        FROM like_dislike_comments
        WHERE comment_id = NEW.comment_id AND like_dislike = 'like';

        SELECT COUNT(*) INTO total_dislikes
        FROM like_dislike_comments
        WHERE comment_id = NEW.comment_id AND like_dislike = 'dislike';

        UPDATE comments
        SET likes = total_likes, dislikes = total_dislikes
        WHERE id = NEW.comment_id;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER update_comment_likes_dislikes
      AFTER UPDATE ON like_dislike_comments
      FOR EACH ROW
      BEGIN
        DECLARE total_likes INT;
        DECLARE total_dislikes INT;

        SELECT COUNT(*) INTO total_likes
        FROM like_dislike_comments
        WHERE comment_id = NEW.comment_id AND like_dislike = 'like';

        SELECT COUNT(*) INTO total_dislikes
        FROM like_dislike_comments
        WHERE comment_id = NEW.comment_id AND like_dislike = 'dislike';

        UPDATE comments
        SET likes = total_likes, dislikes = total_dislikes
        WHERE id = NEW.comment_id;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER delete_comment_likes_dislikes
      AFTER DELETE ON like_dislike_comments
      FOR EACH ROW
      BEGIN
        DECLARE total_likes INT;
        DECLARE total_dislikes INT;

        SELECT COUNT(*) INTO total_likes
        FROM like_dislike_comments
        WHERE comment_id = OLD.comment_id AND like_dislike = 'like';

        SELECT COUNT(*) INTO total_dislikes
        FROM like_dislike_comments
        WHERE comment_id = OLD.comment_id AND like_dislike = 'dislike';

        UPDATE comments
        SET likes = total_likes, dislikes = total_dislikes
        WHERE id = OLD.comment_id;
      END;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Xóa trigger khi rollback migration
    await queryInterface.sequelize.query(
      "DROP TRIGGER insert_comment_likes_dislikes"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER update_comment_likes_dislikes"
    );

    await queryInterface.sequelize.query(
      "DROP TRIGGER delete_comment_likes_dislikes"
    );
  },
};
