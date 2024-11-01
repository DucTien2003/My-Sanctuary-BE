"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class Comment extends Model {}

  Comment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      left_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      right_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      comic_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      chapter_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      tableName: "comments",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return Comment;
};
