const { isEmpty } = require('../utils');

const { getComicById } = require('../services/comicServices.js');
const {
  getImagesOfChapter,
  getChapterById,
  getAllChaptersByComicId,
} = require('../services/chapterServices');

const getChapterPage = async (req, res) => {
  Promise.all([
    getImagesOfChapter(req.params.chapterId),
    getChapterById(req.params.chapterId),
  ])
    .then((values) => {
      if (isEmpty(values[1])) {
        res.status(404).json({ message: 'Chapter not found' });
      } else {
        Promise.all([
          getAllChaptersByComicId(values[1].comic_id),
          getComicById(values[1].comic_id),
        ])
          .then((results) => {
            const [listChapters, comicInfo] = results;
            res.json({
              comicInfo: comicInfo,
              listImages: values[0],
              chapterInfo: values[1],
              listChapters: listChapters,
            });
          })
          .catch((error) => {
            console.log('Error: ', error);
            res.status(500).json({});
          });
      }
    })
    .catch((error) => {
      console.log('Error: ', error);
      res.status(500).json({});
    });
};

module.exports = {
  getChapterPage,
};
