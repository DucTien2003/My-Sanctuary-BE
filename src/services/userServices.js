const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const pool = require("../config/database");
const databaseService = require("./databaseService");
const { isEmpty, convertToCamelCase } = require("../utils");

const loginService = async (username, password) => {
  const user = await databaseService.getUserByUsernameOrEmail(username);

  // Compare the password
  const isPasswordValid =
    !isEmpty(user) && (await bcrypt.compare(password, user.password));

  // If the username or email is incorrect
  if (isEmpty(user) || !isPasswordValid) {
    const errors = [
      {
        field: "username",
        message: "Tài khoản hoặc mật khẩu không đúng",
      },
      {
        field: "password",
        message: "Tài khoản hoặc mật khẩu không đúng",
      },
    ];

    return {
      code: 404,
      success: false,
      message: "Đăng nhập thất bại",
      errors,
    };
  }

  // Generate access token and refresh token
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  const userInfo = await databaseService.saveRefreshToken(
    user.id,
    refreshToken
  );

  return {
    code: 200,
    success: true,
    message: "Đăng nhập thành công",
    accessToken,
    refreshToken,
  };
};

const registerService = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Find or create a user
  const { user, created } =
    await databaseService.findOrCreateUserByUsernameOrEmail(
      username,
      email,
      hashedPassword
    );

  if (created) {
    return {
      code: 200,
      success: true,
      message: "Tạo tài khoản thành công",
    };
  }

  // If the username or email already exists
  const errors = [];

  if (user.username === username) {
    errors.push({
      field: "username",
      message: "Tài khoản đã tồn tại",
    });
  }
  if (user.email === email) {
    errors.push({
      field: "email",
      message: "Email đã tồn tại",
    });
  }

  return {
    code: 409,
    success: false,
    message: "Tạo tài khoản thất bại",
    errors,
  };
};

const forgotPasswordService = async (email) => {
  const userInfo = await databaseService.getUserByUsernameOrEmail(email);

  // If the email is incorrect
  if (isEmpty(userInfo)) {
    const errors = [
      {
        field: "email",
        message: "Email không tồn tại",
      },
    ];

    return {
      code: 404,
      success: false,
      message: "Gửi mã xác nhận thất bại",
      errors,
    };
  }

  // Generate a reset code and save it to the database
  const verificationCode = crypto.randomBytes(4).toString("hex");
  const resetCodeExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  const updatedUserInfo = await databaseService.updateResetCodeByEmail(
    email,
    verificationCode,
    resetCodeExpires
  );

  // Send the verification code to the user's email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.MY_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: "Mã xác nhận đặt lại mật khẩu",
    text: `Mã xác nhận của bạn là ${verificationCode}`,
  };

  await transporter.sendMail(mailOptions);

  return {
    code: 200,
    success: true,
    message: "Gửi mã xác nhận thành công",
  };
};

const resetPasswordService = async (resetCode, password) => {
  const userInfo = await databaseService.getUserByResetCode(resetCode);

  if (isEmpty(userInfo) || userInfo.reset_expires < new Date()) {
    return {
      code: 404,
      success: false,
      message: "Mã xác nhận không hợp lệ hoặc đã hết hạn",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await databaseService.updatePasswordByResetCode(resetCode, hashedPassword);

  return {
    code: 200,
    success: true,
    message: "Đặt lại mật khẩu thành công",
  };
};

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

const updatePasswordByResetCode = async (resetCode, password) => {
  const userInfo = await getUserByResetCode(resetCode);

  if (isEmpty(userInfo) || userInfo.reset_expires < new Date()) {
    return {
      success: false,
      message: "Your verification code is invalid or has expired",
    };
  } else {
    try {
      const [result] = await pool.query(
        "UPDATE users SET password = ?, reset_code = ?, reset_expires = ? WHERE reset_code = ?",
        [password, null, null, resetCode]
      );

      if (result.affectedRows === 0) {
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.log("Error: ", error);
      return { success: false };
    }
  }
};

module.exports = {
  createUser,
  getUserById,
  loginService,
  getUsersByIds,
  registerService,
  resetPasswordService,
  forgotPasswordService,
};
