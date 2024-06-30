const {
  getChapterById,
  updateChapterViews,
  getImagesOfChapter,
  getAllChaptersByComicId,
} = require('../services/chapterServices');

const handleGetImagesOfChapter = async (req, res) => {
  const chapterId = req.params.chapterId;

  getImagesOfChapter(chapterId)
    .then((images) => {
      return res.json(images);
    })
    .catch((error) => {
      console.log('Error: ', error);
      return res.status(500).json([]);
    });
};

const handleGetChapterById = async (req, res) => {
  const chapterId = req.params.chapterId;

  getChapterById(chapterId)
    .then((chapters) => {
      return res.json(chapters);
    })
    .catch((error) => {
      console.log('Error: ', error);
      return res.status(500).json({});
    });
};

const handleGetAllChaptersByComicId = async (req, res) => {
  const comicId = req.params.comicId;

  getAllChaptersByComicId(comicId)
    .then((chapters) => {
      return res.json(chapters);
    })
    .catch((error) => {
      console.log('Error: ', error);
      return res.status(500).json([]);
    });
};

const handleUpdateChapterViews = async (req, res) => {
  const chapterId = req.params.chapterId;

  updateChapterViews(chapterId)
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => {
      console.log('Error handleUpdateChapterViews: ', error);
      return res.status(500).json(false);
    });
};

module.exports = {
  handleGetChapterById,
  handleUpdateChapterViews,
  handleGetImagesOfChapter,
  handleGetAllChaptersByComicId,
};
