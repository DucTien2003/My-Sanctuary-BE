"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("comics", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cover: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("ongoing", "dropped", "completed"),
        allowNull: false,
        defaultValue: "ongoing",
      },
      author: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      translator: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      bookmarks: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      comments: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      number_of_chapters: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      name_minio: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      poster_id: {
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE comics
      DROP FOREIGN KEY comics_ibfk_1;
    `);

    await queryInterface.dropTable("comics");
  },
};
