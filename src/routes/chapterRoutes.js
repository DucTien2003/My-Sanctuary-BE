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

// Get chapter
router.get("/:chapterId", handleGetChapterById);
// Create chapter
router.post("/", authenticateToken, upload.any(), handleCreateChapter);
// Update chapter
router.put("/:chapterId", authenticateToken, upload.any(), handleUpdateChapter);
// Delete chapter
router.delete("/:chapterId", authenticateToken, handleDeleteChapterById);
// Get chapter images
// router.get("/:chapterId/all-images", handleGetImagesOfChapter);
// Update chapter views
router.put("/:chapterId/update-views", handleUpdateChapterViews);
// Get chapters by comic id
// router.get("/:comicId/comic-chapters", handleGetAllChaptersByComicId);

module.exports = router;
