"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class Image extends Model {}

  Image.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      number_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      chapter_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Image",
      tableName: "images",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return Image;
};
