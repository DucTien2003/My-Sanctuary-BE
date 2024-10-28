"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class BookmarkComicUser extends Model {}

  BookmarkComicUser.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      comic_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BookmarkComicUser",
      tableName: "bookmark_comics_users",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return BookmarkComicUser;
};
