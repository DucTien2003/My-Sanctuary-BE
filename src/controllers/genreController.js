const services = require("../services");

const handleGetGenres = async (req, res) => {
  try {
    const { code, success, message, ...data } =
      await services.getGenresService();
    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleGetGenres: ", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

module.exports = {
  handleGetGenres,
};
