const { Sequelize } = require("sequelize");

const { User } = require("../../models");
const { isEmpty, convertToCamelCase } = require("../../utils");

const saveRefreshToken = async (userId, refreshToken) => {
  const [count] = await User.update(
    { refresh_token: refreshToken },
    {
      where: { id: userId },
    }
  );

  const user = await User.findOne({ where: { id: userId } });

  return convertToCamelCase(user);
};

const getUserByUsernameOrEmail = async (usernameOrEmail) => {
  const user = await User.findOne({
    where: {
      [Sequelize.Op.or]: [
        { username: usernameOrEmail },
        { email: usernameOrEmail },
      ],
    },
  });

  return !isEmpty(user) ? convertToCamelCase(user.dataValues) : {};
};

const createUserByUsernameOrEmail = async (username, email, password) => {
  const [user, created] = await User.findOrCreate({
    where: {
      [Sequelize.Op.or]: [{ username }, { email }],
    },
    defaults: { name: username, username, email, password },
  });

  return { user: convertToCamelCase(user.dataValues), created };
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

  const user = await User.findOne({ where: { email } });

  return convertToCamelCase(user.dataValues);
};

const getUserByResetCode = async (resetCode) => {
  const user = await User.findOne({
    where: {
      reset_token: resetCode,
    },
  });

  return !isEmpty(user) ? convertToCamelCase(user) : {};
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

const getUserByRefreshToken = async (refreshToken) => {
  const user = await User.findOne({
    where: {
      refresh_token: refreshToken,
    },
  });

  return !isEmpty(user) ? convertToCamelCase(user.dataValues) : {};
};

module.exports = {
  saveRefreshToken,
  getUserByUsernameOrEmail,
  createUserByUsernameOrEmail,
  updateResetCodeByEmail,
  getUserByResetCode,
  updatePasswordByResetCode,
  getUserByRefreshToken,
};
