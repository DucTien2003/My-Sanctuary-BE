const userServices = require("../services/userServices");

const handleLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const { code, success, message, refreshToken, ...rest } =
      await userServices.loginService(username, password);

    // Set cookie refreshToken
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // true for https, false for http
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(code).json({ code, success, message, data: rest });
  } catch (error) {
    console.log("Error handleLogin: ", error);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleRegister = async (req, res, next) => {
  const { username, password, email } = req.body;

  try {
    const { code, success, message, ...rest } =
      await userServices.registerService(username, email, password);

    return res.status(code).json({ code, success, message, data: rest });
  } catch (error) {
    console.log("Error handleRegister: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const { code, success, message, ...rest } =
      await userServices.forgotPasswordService(email);

    return res.status(code).json({ code, success, message, data: rest });
  } catch (error) {
    console.log("Error handleForgotPassword: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleResetPassword = async (req, res, next) => {
  const { verificationCode, password } = req.body;

  try {
    const { code, success, message, ...rest } =
      await userServices.resetPasswordService(verificationCode, password);

    return res.status(code).json({ code, success, message, data: rest });
  } catch (error) {
    console.log("Error handleResetPassword: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

module.exports = {
  handleLogin,
  handleRegister,
  handleResetPassword,
  handleForgotPassword,
};
