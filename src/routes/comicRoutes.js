const express = require("express");
const multer = require("multer");

const authenticateToken = require("../middleware/authenticateToken.js");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
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
} = require("../controllers/comicController.js");

const router = express.Router();

router.get("/", handleGetComics);
router.post("/", upload.any(), authenticateToken, handleCreateComic);

router.get("/:comicId", handleGetComicByComicId);
router.put("/:comicId", upload.any(), handleUpdateComicByComicId);
router.delete("/:comicId", handleDeleteComicByComicId);

router.post("/:comicId/rating", handleCreateOrUpdateRatingByUserForComic);
router.put("/:comicId/rating", handleCreateOrUpdateRatingByUserForComic);
router.delete("/:comicId/rating", handleDeleteRatingByUserForComic);

router.get("/:comicId/chapters", handleGetChaptersByComicId);

router.post("/:comicId/bookmark", handleCreateBookmarkByUserForComic);
router.delete("/:comicId/bookmark", handleDeleteBookmarkByUserForComic);

router.get("/:comicId/comments", handleGetCommentsByComicId);

module.exports = router;
