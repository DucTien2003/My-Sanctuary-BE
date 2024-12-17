const databaseService = require("./databaseService");
const { isEmpty } = require("../utils");

const getGenresService = async () => {
  const { count, genres } = await databaseService.getGenres();

  if (isEmpty(genres)) {
    return {
      code: 404,
      success: false,
      message: "Không có thể loại nào",
    };
  }

  return {
    code: 200,
    success: true,
    message: "Lấy danh sách thể loại thành công",
    genres,
    count,
  };
};

module.exports = { getGenresService };
