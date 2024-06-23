const { getComicById } = require('../services/comicServices.js');
const { getAllChaptersByComicId } = require('../services/chapterServices');

const getComicPage = async (req, res) => {
  Promise.all([
    getComicById(req.params.comicId),
    getAllChaptersByComicId(req.params.comicId),
  ])
    .then((values) => {
      res.json({
        comicInfo: values[0],
        listChapters: values[1],
      });
    })
    .catch((error) => {
      console.log('Error: ', error);
      res.status(500).json({});
    });
};

module.exports = {
  getComicPage,
};
