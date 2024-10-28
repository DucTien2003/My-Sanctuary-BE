"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class RatingComicUser extends Model {}

  RatingComicUser.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      modelName: "RatingComicUser",
      tableName: "rating_comics_users",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return RatingComicUser;
};
