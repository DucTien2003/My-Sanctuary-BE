const { Sequelize } = require("sequelize");

const pool = require("../../config/database");
const { isEmpty, convertToCamelCase } = require("../../utils");
const { User } = require("../../models");

const getUserById = async (userId) => {
  try {
    const [userInfo] = await pool.query("SELECT * FROM users WHERE id = ?", [
      userId,
    ]);

    return userInfo.length > 0 ? convertToCamelCase(userInfo[0]) : {};
  } catch (error) {
    console.log("Error: ", error);
    return {};
  }
};

const getUsersByIds = async (userIds) => {
  if (userIds.length === 0) {
    return [];
  }

  const placeholders = userIds.map(() => "?").join(", ");
  try {
    const [usersInfo] = await pool.query(
      `SELECT * FROM users WHERE id IN (${placeholders})`,
      userIds
    );

    if (usersInfo.length === 0) {
      return [];
    }

    return convertToCamelCase(usersInfo);
  } catch (error) {
    console.log("Error: ", error);
    return [];
  }
};

const saveRefreshToken = async (userId, refreshToken) => {
  const [count] = await User.update(
    { refresh_token: refreshToken },
    {
      where: { id: userId },
    }
  );

  const userInfo = await User.findOne({ where: { id: userId } });

  return convertToCamelCase(userInfo);
};

const getUserByUsernameOrEmail = async (usernameOrEmail) => {
  const userInfo = await User.findOne({
    where: {
      [Sequelize.Op.or]: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    },
  });

  return !isEmpty(userInfo) ? convertToCamelCase(userInfo.dataValues) : {};
};

const findOrCreateUserByUsernameOrEmail = async (username, email, password) => {
  const [user, created] = await User.findOrCreate({
    where: {
      [Sequelize.Op.or]: [{ username }, { email }],
    },
    defaults: { name: username, username, email, password },
  });

  return { user: convertToCamelCase(user.dataValues), created };
};

const createUser = async (username, password, email) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (name, username, password, email) VALUES (?, ?, ?, ?)",
      [username, username, password, email]
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log("Error: ", error);
    return { success: false };
  }
};

const updateResetCodeByEmail = async (email, resetCode, expires) => {
  const [count] = await User.update(
    {
      reset_token: resetCode,
      reset_token_expires: expires,
    },
    {
      where: { email },
    }
  );

  const userInfo = await User.findOne({ where: { email } });

  return convertToCamelCase(userInfo);
};

const getUserByResetCode = async (resetCode) => {
  const userInfo = await User.findOne({
    where: {
      reset_token: resetCode,
    },
  });

  return !isEmpty(userInfo) ? convertToCamelCase(userInfo) : {};
};

const updatePasswordByResetCode = async (resetCode, password) => {
  const [count] = await User.update(
    {
      password,
      reset_token: null,
      reset_token_expires: null,
    },
    {
      where: { reset_token: resetCode },
    }
  );

  return count > 0;
};

module.exports = {
  createUser,
  getUserById,
  getUsersByIds,
  saveRefreshToken,
  getUserByResetCode,
  updateResetCodeByEmail,
  getUserByUsernameOrEmail,
  updatePasswordByResetCode,
  findOrCreateUserByUsernameOrEmail,
};
