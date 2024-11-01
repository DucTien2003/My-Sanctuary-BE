"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class Comic extends Model {}

  Comic.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subname: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cover: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("ongoing", "dropped", "completed"),
        allowNull: false,
        defaultValue: "ongoing",
      },
      author: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      translator: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      bookmarks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      name_minio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      poster_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comic",
      tableName: "comics",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return Comic;
};
