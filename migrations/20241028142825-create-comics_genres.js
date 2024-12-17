"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comics_genres", {
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
      genre_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "genres",
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

    // Thiết lập composite primary key cho `comic_id` và `genre_id`
    await queryInterface.addConstraint("comics_genres", {
      fields: ["comic_id", "genre_id"],
      type: "primary key",
      name: "comics_genres_pk",
    });

    await queryInterface.addIndex("comics_genres", ["comic_id"], {
      name: "index_comics_genres_on_comic_id",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE comics_genres
      DROP FOREIGN KEY comics_genres_ibfk_1;
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE comics_genres
      DROP FOREIGN KEY comics_genres_ibfk_2;
    `);

    await queryInterface.removeIndex(
      "comics_genres",
      "index_comics_genres_on_comic_id"
    );

    await queryInterface.dropTable("comics_genres");
  },
};
