"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comments", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      likes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      dislikes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      left_value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      right_value: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      root: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      comic_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "comics",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      chapter_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: "chapters",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });

    await queryInterface.addIndex("comments", ["comic_id"], {
      name: "index_comments_on_comic_id",
    });

    await queryInterface.addIndex("comments", ["chapter_id"], {
      name: "index_comments_on_chapter_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE comments
      DROP FOREIGN KEY comments_ibfk_1;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE comments
      DROP FOREIGN KEY comments_ibfk_2;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE comments
      DROP FOREIGN KEY comments_ibfk_3;
    `);

    await queryInterface.removeIndex("comments", "index_comments_on_comic_id");

    await queryInterface.removeIndex(
      "comments",
      "index_comments_on_chapter_id"
    );

    await queryInterface.dropTable("comments");
  },
};
