"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class RatingComicUser extends Model {}

  RatingComicUser.init(
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: () => uuidv4(),
      //   primaryKey: true,
      // },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
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
      modelName: "RatingComicUser",
      tableName: "rating_comics_users",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return RatingComicUser;
};
