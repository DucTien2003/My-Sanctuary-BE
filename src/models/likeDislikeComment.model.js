"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class LikeDislikeComment extends Model {}

  LikeDislikeComment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      like_dislike: {
        type: DataTypes.ENUM("like", "dislike"),
        allowNull: false,
      },
      comment_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "LikeDislikeComment",
      tableName: "likes_dislikes_comment",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return LikeDislikeComment;
};
