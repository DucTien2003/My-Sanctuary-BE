"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class ComicGenre extends Model {}

  ComicGenre.init(
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: () => uuidv4(),
      //   primaryKey: true,
      // },
      comic_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: "comics",
        //   key: "id",
        // },
        // onUpdate: "CASCADE",
        // onDelete: "CASCADE",
      },
      genre_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        // references: {
        //   model: "genres",
        //   key: "id",
        // },
        // onUpdate: "CASCADE",
        // onDelete: "CASCADE",
      },
    },
    {
      sequelize,
      modelName: "ComicGenre",
      tableName: "comics_genres",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return ComicGenre;
};
