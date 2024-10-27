const express = require("express");
const multer = require("multer");

const authenticateToken = require("../middleware/authenticateToken.js");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  handleCreateChapter,
  handleUpdateChapter,
  handleGetChapterById,
  handleDeleteChapterById,
  handleUpdateChapterViews,
  handleGetImagesOfChapter,
  handleGetAllChaptersByComicId,
} = require("../controllers/chapterController.js");

const router = express.Router();

router.get("/:chapterId", handleGetChapterById);
router.post("/", authenticateToken, upload.any(), handleCreateChapter);
router.put("/:chapterId", authenticateToken, upload.any(), handleUpdateChapter);
router.delete("/:chapterId", authenticateToken, handleDeleteChapterById);
router.get("/all-images/:chapterId", handleGetImagesOfChapter);
router.put("/update-views/:chapterId", handleUpdateChapterViews);
router.get("/comic-chapters/:comicId", handleGetAllChaptersByComicId);

module.exports = router;
