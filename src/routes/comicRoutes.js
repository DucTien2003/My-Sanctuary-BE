const express = require("express");
const multer = require("multer");

const { authenticateToken, getInfoToken } = require("../middleware");
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

router.get("/:comicId", getInfoToken, handleGetComicByComicId);
router.put("/:comicId", upload.any(), handleUpdateComicByComicId);
router.delete("/:comicId", handleDeleteComicByComicId);

router.post(
  "/:comicId/rating",
  authenticateToken,
  handleCreateOrUpdateRatingByUserForComic
);
router.put(
  "/:comicId/rating",
  authenticateToken,
  handleCreateOrUpdateRatingByUserForComic
);
router.delete(
  "/:comicId/rating",
  authenticateToken,
  handleDeleteRatingByUserForComic
);

router.get("/:comicId/chapters", handleGetChaptersByComicId);

router.post(
  "/:comicId/bookmark",
  authenticateToken,
  handleCreateBookmarkByUserForComic
);
router.delete(
  "/:comicId/bookmark",
  authenticateToken,
  handleDeleteBookmarkByUserForComic
);

router.get("/:comicId/comments", handleGetCommentsByComicId);

module.exports = router;
