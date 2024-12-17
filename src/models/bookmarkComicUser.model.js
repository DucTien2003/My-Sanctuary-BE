"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class BookmarkComicUser extends Model {}

  BookmarkComicUser.init(
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
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
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
