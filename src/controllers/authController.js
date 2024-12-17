const services = require("../services");

const handleLogin = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const { code, success, message, ...rest } = await services.loginService(
      username,
      password
    );

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
    const { code, success, message, ...rest } = await services.registerService(
      username,
      email,
      password
    );

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
      await services.forgotPasswordService(email);

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
      await services.resetPasswordService(verificationCode, password);

    return res.status(code).json({ code, success, message, data: rest });
  } catch (error) {
    console.log("Error handleResetPassword: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleResetAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const { code, success, message, ...rest } =
      await services.resetAccessTokenService(refreshToken);

    return res
      .status(code)
      .json({ code, success, message, data: rest.accessToken });
  } catch (error) {
    console.log("Error handleResetAccessToken: ", error.message);

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
  handleResetAccessToken,
};
