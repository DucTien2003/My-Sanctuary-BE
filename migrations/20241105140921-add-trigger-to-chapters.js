"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo trigger để cập nhật số comments của chapter khi có comment mới
    await queryInterface.sequelize.query(`
      CREATE TRIGGER insert_chapter_comment_count
      AFTER INSERT ON comments
      FOR EACH ROW
      BEGIN
        DECLARE total_comments INT;

        SELECT COUNT(*) INTO total_comments
        FROM comments
        WHERE chapter_id = NEW.chapter_id;

        UPDATE chapters
        SET comments = total_comments
        WHERE id = NEW.chapter_id;
      END;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER delete_chapter_comment_count
      AFTER DELETE ON comments
      FOR EACH ROW
      BEGIN
        DECLARE total_comments INT;

        SELECT COUNT(*) INTO total_comments
        FROM comments
        WHERE chapter_id = OLD.chapter_id;

        UPDATE chapters
        SET comments = total_comments
        WHERE id = OLD.chapter_id;
      END;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "DROP TRIGGER insert_chapter_comment_count"
    );
    await queryInterface.sequelize.query(
      "DROP TRIGGER delete_chapter_comment_count"
    );
  },
};
