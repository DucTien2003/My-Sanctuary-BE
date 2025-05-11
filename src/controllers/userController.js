const services = require("../services");

const handleGetUserByMyId = async (req, res) => {
  const userId = req.id;

  try {
    const { code, success, message, ...data } =
      await services.getUserByUserIdService({ userId });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleGetUserByMyId: ", error);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleGetUserByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const { code, success, message, ...data } =
      await services.getUserByUserIdService({ userId });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleGetUserByUserId: ", error);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleGetComicsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const { code, success, message, ...data } =
      await services.getComicsByUserIdService(userId);

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleGetComicsByUserId: ", error);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleGetComicsByMyId = async (req, res) => {
  const userId = req.id;

  try {
    const { code, success, message, ...data } =
      await services.getComicsByUserIdService({
        userId,
        ...req.query,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleGetComicsByMyId: ", error);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

module.exports = {
  handleGetUserByMyId,
  handleGetUserByUserId,
  handleGetComicsByUserId,
  handleGetComicsByMyId,
};
