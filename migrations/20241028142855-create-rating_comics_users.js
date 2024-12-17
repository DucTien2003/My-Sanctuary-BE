"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rating_comics_users", {
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

    // Thiết lập composite primary key cho comic_id và user_id
    await queryInterface.addConstraint("rating_comics_users", {
      fields: ["comic_id", "user_id"],
      type: "primary key",
      name: "rating_comics_users_pk",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("rating_comics_users");
  },
};
