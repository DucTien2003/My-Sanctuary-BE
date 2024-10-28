"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Chapter extends Model {}

  Chapter.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      index: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name_minio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      comments: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      comic_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Chapter",
      tableName: "chapters",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return Chapter;
};
