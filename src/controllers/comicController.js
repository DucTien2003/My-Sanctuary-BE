const { isEmpty, formatPath } = require("../utils");

const services = require("../services");

const handleGetComicByComicId = async (req, res) => {
  const userId = req.id;
  const comicId = req.params.comicId;
  const { limit, orderBy, order, page } = req.query;

  try {
    const { code, success, message, ...data } =
      await services.getComicByComicIdService({
        comicId,
        userId,
        limit,
        orderBy,
        order,
        page,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleGetComicByComicId: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleCreateOrUpdateRatingByUserForComic = async (req, res) => {
  const userId = req.id;
  const ratingData = req.body.rating;
  const comicId = req.params.comicId;

  try {
    const { code, success, message, ...data } =
      await services.createOrUpdateRatingByUserForComicService({
        comicId,
        userId,
        ratingData,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log(
      "Error handleCreateOrUpdateRatingByUserForComic: ",
      error.message
    );

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleDeleteRatingByUserForComic = async (req, res) => {
  const userId = req.id;
  const comicId = req.params.comicId;

  try {
    const { code, success, message, ...data } =
      await services.deleteRatingByUserForComicService({ comicId, userId });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleDeleteRatingByUserForComic: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleCreateBookmarkByUserForComic = async (req, res) => {
  const userId = req.id;
  const comicId = req.params.comicId;

  try {
    const { code, success, message, ...data } =
      await services.createBookmarkByUserForComicService({ comicId, userId });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleCreateBookmarkByUserForComic: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleDeleteBookmarkByUserForComic = async (req, res) => {
  const userId = req.id;
  const comicId = req.params.comicId;

  try {
    const { code, success, message } =
      await services.deleteBookmarkByUserForComicService({ comicId, userId });

    return res.status(code).json({ code, success, message });
  } catch (error) {
    console.log("Error handleDeleteBookmarkByUserForComic: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleCreateComic = async (req, res) => {
  const userId = req.id;
  const coverFile = req.files[0];
  const comicInfo = JSON.parse(req.body.comicInfo);

  try {
    const { code, success, message, ...data } =
      await services.createComicService({
        userId,
        coverFile,
        comicInfo,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleCreateComic: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleUpdateComicByComicId = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  const comicId = req.params.comicId;
  const userId = req.id;
  const coverFile = req.files[0];
  const comicInfo = JSON.parse(req.body.comicInfo);
  const oldComicInfo = JSON.parse(req.body.oldComicInfo);

  try {
    const { code, success, message, ...data } =
      await services.updateComicByComicIdService({
        userId,
        comicId,
        coverFile,
        comicInfo,
        oldComicInfo,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleUpdateComicByComicId: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleDeleteComicByComicId = async (req, res) => {
  const comicId = req.params.comicId;

  try {
    const { code, success, message, ...data } =
      await services.deleteComicByComicIdService({ comicId });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleDeleteComicByComicId: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleGetComics = async (req, res) => {
  try {
    const { code, success, message, ...data } = await services.getComicsService(
      req.query
    );

    return res.status(code).json({ code, success, message, data: data });
  } catch (error) {
    console.log("Error handleGetComics: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleGetChaptersByComicId = async (req, res) => {
  const comicId = req.params.comicId;
  const { limit, page, orderBy, order } = req.query;

  try {
    const { code, success, message, ...data } =
      await services.getChaptersByComicIdService({
        comicId,
        limit,
        page,
        orderBy,
        order,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleGetChaptersByComicId: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleGetCommentsByComicId = async (req, res) => {
  const comicId = req.params.comicId;
  const { limit, orderBy, order, page } = req.query;

  try {
    const { code, success, message, ...data } =
      await services.getCommentsByComicIdService({
        comicId,
        limit,
        orderBy,
        order,
        page,
      });

    return res.status(code).json({ code, success, message, data: data });
  } catch (error) {
    console.log("Error handleGetCommentsByComicId: ", error.message);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleGetBookmarkComicsByUserId = async (req, res) => {
  const userId = req.id;
  const { limit, orderBy, order, page } = req.query;

  try {
    const { code, success, message, ...data } =
      await services.getBookmarkComicsByUserIdService({
        userId,
        limit,
        orderBy,
        order,
        page,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleGetBookmarkComicsByUserId: ", error.message);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

module.exports = {
  handleGetComicByComicId,
  handleCreateOrUpdateRatingByUserForComic,
  handleDeleteRatingByUserForComic,
  handleCreateBookmarkByUserForComic,
  handleDeleteBookmarkByUserForComic,
  handleCreateComic,
  handleUpdateComicByComicId,
  handleDeleteComicByComicId,
  handleGetComics,
  handleGetChaptersByComicId,
  handleGetCommentsByComicId,
  handleGetBookmarkComicsByUserId,
};
