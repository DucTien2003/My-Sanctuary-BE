"use strict";
const { Model, DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "poster", "user"),
        allowNull: false,
        defaultValue: "user",
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      reset_token_expires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true, // Tự động xử lý createdAt và updatedAt
      underscored: true, // Tự động chuyển cột thành snake_case
    }
  );

  return User;
};
