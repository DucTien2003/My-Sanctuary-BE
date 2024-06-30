const express = require('express');
const router = express.Router();

const {
  handleGetChapterById,
  handleUpdateChapterViews,
  handleGetImagesOfChapter,
  handleGetAllChaptersByComicId,
} = require('../controllers/chapterController.js');

router.get('/:chapterId', handleGetChapterById);
router.get('/all-images/:chapterId', handleGetImagesOfChapter);
router.put('/update-views/:chapterId', handleUpdateChapterViews);
router.get('/comic-chapters/:comicId', handleGetAllChaptersByComicId);

module.exports = router;
