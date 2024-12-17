"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class LikeDislikeComment extends Model {}

  LikeDislikeComment.init(
    {
      // id: {
      //   type: DataTypes.UUID,
      //   defaultValue: () => uuidv4(),
      //   primaryKey: true,
      // },
      like_dislike: {
        type: DataTypes.ENUM("like", "dislike"),
        allowNull: false,
      },
      comment_id: {
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
      modelName: "LikeDislikeComment",
      tableName: "like_dislike_comments",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return LikeDislikeComment;
};
