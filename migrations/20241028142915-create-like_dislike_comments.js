"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("like_dislike_comments", {
      like_dislike: {
        type: Sequelize.ENUM("like", "dislike"),
        allowNull: false,
      },
      comment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "comments",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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

    // Composite primary key
    await queryInterface.addConstraint("like_dislike_comments", {
      fields: ["comment_id", "user_id"],
      type: "primary key",
      name: "like_dislike_comments_pk",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("like_dislike_comments");
  },
};
