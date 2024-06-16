const connection = require('../config/database.js');

const { getImagesOfChapter } = require('../services/chapterServices');

const getChapterPage = async (req, res) => {
  const results = await getImagesOfChapter();

  res.json(results);
};

module.exports = {
  getChapterPage,
};
