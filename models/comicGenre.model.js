"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class ComicGenre extends Model {}

  ComicGenre.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      comic_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      genre_id: {
        type: DataTypes.STRING,
        allowNull: false,
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
