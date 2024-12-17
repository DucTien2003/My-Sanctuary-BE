const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const databaseService = require("./databaseService");
const { isEmpty } = require("../utils");

const loginService = async (username, password) => {
  const userInfo = await databaseService.getUserByUsernameOrEmail(username);

  // Compare the password
  const isPasswordValid =
    !isEmpty(userInfo) && (await bcrypt.compare(password, userInfo.password));

  // If the username or email is incorrect
  if (isEmpty(userInfo) || !isPasswordValid) {
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
      id: userInfo.id,
      role: userInfo.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    {
      id: userInfo.id,
      role: userInfo.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  await databaseService.saveRefreshToken(userInfo.id, refreshToken);

  const user = {
    id: userInfo.id,
    role: userInfo.role,
    name: userInfo.name,
    email: userInfo.email,
    avatar: userInfo.avatar,
    username: userInfo.username,
    createdAt: userInfo.createdAt,
    updatedAt: userInfo.updatedAt,
    accessToken,
    refreshToken,
  };

  return {
    code: 200,
    success: true,
    message: "Đăng nhập thành công",
    ...user,
  };
};

const registerService = async (username, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Find or create a user
  const { user, created } = await databaseService.createUserByUsernameOrEmail(
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
  const user = await databaseService.getUserByUsernameOrEmail(email);

  // If the email is incorrect
  if (isEmpty(user)) {
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

  const updatedUser = await databaseService.updateResetCodeByEmail(
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
  const user = await databaseService.getUserByResetCode(resetCode);

  if (isEmpty(user) || user.reset_expires < new Date()) {
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

const resetAccessTokenService = (refreshToken) => {
  return new Promise((resolve) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) {
          return resolve({
            code: 401,
            success: false,
            message: "Refresh token đã hết hạn hoặc không hợp lệ",
          });
        } else {
          try {
            const user =
              await databaseService.getUserByRefreshToken(refreshToken);

            if (isEmpty(user) || user.id !== payload.id) {
              console.log("User not found or invalid user", user, payload);
              return resolve({
                code: 401,
                success: false,
                message: "Tạo access token thất bại",
              });
            }

            // Generate a new access token
            const accessToken = jwt.sign(
              {
                id: user.id,
                role: user.role,
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: "1d" }
            );

            return resolve({
              code: 200,
              success: true,
              message: "Tạo access token thành công",
              accessToken,
            });
          } catch (error) {
            return resolve({
              code: 500,
              success: false,
              message: "Đã xảy ra lỗi khi tạo access token",
              error: error.message,
            });
          }
        }
      }
    );
  });
};

module.exports = {
  loginService,
  registerService,
  forgotPasswordService,
  resetPasswordService,
  resetAccessTokenService,
};
