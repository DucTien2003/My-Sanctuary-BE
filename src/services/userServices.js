const pool = require('../config/database');
const { isEmpty, convertToCamelCase } = require('../utils');

const getUserById = async (userId) => {
  try {
    const [userInfo] = await pool.query('SELECT * FROM users WHERE id = ?', [
      userId,
    ]);

    return userInfo.length > 0 ? convertToCamelCase(userInfo[0]) : {};
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const getUsersByIds = async (userIds) => {
  if (userIds.length === 0) {
    return [];
  }

  const placeholders = userIds.map(() => '?').join(', ');
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
    console.log('Error: ', error);
    return [];
  }
};

const getUserByUsername = async (username) => {
  try {
    const [userInfo] = await pool.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    return userInfo.length > 0 ? convertToCamelCase(userInfo[0]) : {};
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const getUserByEmail = async (email) => {
  try {
    const [userInfo] = await pool.query('SELECT * FROM users WHERE email = ?', [
      email,
    ]);

    return userInfo.length > 0 ? convertToCamelCase(userInfo[0]) : {};
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const createUser = async (username, password, email) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, username, password, email) VALUES (?, ?, ?, ?)',
      [username, username, password, email]
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log('Error: ', error);
    return { success: false };
  }
};

const updateResetCodeByEmail = async (email, resetCode, expires) => {
  try {
    const [result] = await pool.query(
      'UPDATE users SET reset_code = ?, reset_expires = ? WHERE email = ?',
      [resetCode, expires, email]
    );

    if (result.affectedRows === 0) {
      return { success: false, message: 'No user found with the given email' };
    }

    return { success: true };
  } catch (error) {
    console.log('Error: ', error);
    return { success: false };
  }
};

const getUserByResetCode = async (resetCode) => {
  try {
    const [userInfo] = await pool.query(
      'SELECT * FROM users WHERE reset_code = ?',
      [resetCode]
    );

    return userInfo.length > 0 ? convertToCamelCase(userInfo[0]) : {};
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const updatePasswordByResetCode = async (resetCode, password) => {
  const userInfo = await getUserByResetCode(resetCode);

  if (isEmpty(userInfo) || userInfo.reset_expires < new Date()) {
    return {
      success: false,
      message: 'Your verification code is invalid or has expired',
    };
  } else {
    try {
      const [result] = await pool.query(
        'UPDATE users SET password = ?, reset_code = ?, reset_expires = ? WHERE reset_code = ?',
        [password, null, null, resetCode]
      );

      if (result.affectedRows === 0) {
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.log('Error: ', error);
      return { success: false };
    }
  }
};

module.exports = {
  createUser,
  getUserById,
  getUsersByIds,
  getUserByEmail,
  getUserByUsername,
  updateResetCodeByEmail,
  updatePasswordByResetCode,
};
