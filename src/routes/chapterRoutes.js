const express = require("express");
const multer = require("multer");

// const {authenticateToken} = require("../middleware");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  handleGetImagesOfChapter,
  handleGetChapterByChapterId,
  handleUpdateChapterViewsByChapterId,
  handleCreateChapter,
  handleUpdateChapterByChapterId,
  handleDeleteChapterByChapterId,
} = require("../controllers/chapterController.js");

const router = express.Router();

router.post("/", upload.any(), handleCreateChapter);

router.get("/:chapterId", handleGetChapterByChapterId);
router.delete("/:chapterId", handleDeleteChapterByChapterId);
router.put("/:chapterId", upload.any(), handleUpdateChapterByChapterId);

router.put("/:chapterId/views", handleUpdateChapterViewsByChapterId);

router.get("/:chapterId/images", handleGetImagesOfChapter);

module.exports = router;
