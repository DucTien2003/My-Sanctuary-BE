// const { uploadImage, removeChapter } = require("../services/minIOServices");
const services = require("../services");

const handleGetImagesOfChapter = async (req, res) => {
  const chapterId = req.params.chapterId;

  try {
    const { code, success, message, ...data } =
      await services.getImagesByChapterIdService({ chapterId });

    return res.status(code).json({ code, success, message, data: data });
  } catch (error) {
    console.log("Error handleGetImagesOfChapter: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleGetChapterByChapterId = async (req, res) => {
  const chapterId = req.params.chapterId;

  try {
    const { code, success, message, ...data } =
      await services.getChapterByChapterIdService({ chapterId });

    return res.status(code).json({ code, success, message, data: data });
  } catch (error) {
    console.log("Error handleGetChapterByChapterId: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleUpdateChapterViewsByChapterId = async (req, res) => {
  const chapterId = req.params.chapterId;

  try {
    const { code, success, message, ...data } =
      await services.updateChapterViewsByChapterIdService({ chapterId });

    return res.status(code).json({ code, success, message, data: data });
  } catch (error) {
    console.log("Error handleUpdateChapterViewsByChapterId: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleCreateChapter = async (req, res) => {
  const imageFiles = req.files;
  const comicInfo = JSON.parse(req.body.comicInfo);
  const chapterData = JSON.parse(req.body.chapterData);

  try {
    const { code, success, message, ...data } =
      await services.createChapterService({
        imageFiles,
        comicInfo,
        chapterData,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleCreateComic: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleUpdateChapterByChapterId = async (req, res) => {
  const chapterId = req.params.chapterId;
  const imageFiles = req.files;
  const comicInfo = JSON.parse(req.body.comicInfo);
  const chapterData = JSON.parse(req.body.chapterData);

  try {
    const { code, success, message, ...data } =
      await services.updateChapterByChapterIdService({
        chapterId,
        comicInfo,
        imageFiles,
        chapterData,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleUpdateChapterByChapterId: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleDeleteChapterByChapterId = async (req, res) => {
  const chapterId = req.params.chapterId;
  const comicNameMinio = req.query.comicNameMinio;
  const chapterNameMinio = req.query.chapterNameMinio;

  try {
    const { code, success, message, ...data } =
      await services.deleteChapterByChapterIdService({
        chapterId,
        comicNameMinio,
        chapterNameMinio,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleDeleteChapterByChapterId: ", error.message);

    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

module.exports = {
  handleGetImagesOfChapter,
  handleGetChapterByChapterId,
  handleUpdateChapterViewsByChapterId,
  handleCreateChapter,
  handleUpdateChapterByChapterId,
  handleDeleteChapterByChapterId,
};
