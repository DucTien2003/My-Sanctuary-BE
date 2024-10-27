const express = require("express");
const multer = require("multer");

const authenticateToken = require("../middleware/authenticateToken.js");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  handleCreateComic,
  handleGetAllGenres,
  handleGetComicById,
  handleGetListComics,
  handleUpdateComicById,
  handleDeleteComicById,
  handleGetComicsByAuthId,
  handleCreateComicRating,
  handleUpdateComicRating,
  handleDeleteComicRating,
  handleCreateComicBookmark,
  handleDeleteComicBookmark,
} = require("../controllers/comicController.js");

const router = express.Router();

router.get("/all-genres", handleGetAllGenres);
router.get("/list-comics", handleGetListComics);
router.post("/", authenticateToken, upload.any(), handleCreateComic);
router.get("/auth", authenticateToken, handleGetComicsByAuthId);

router.get("/:comicId", authenticateToken, handleGetComicById);
router.delete("/:comicId", authenticateToken, handleDeleteComicById);
router.put("/:comicId", authenticateToken, upload.any(), handleUpdateComicById);

router.put("/rating/:comicId", authenticateToken, handleUpdateComicRating);
router.post("/rating/:comicId", authenticateToken, handleCreateComicRating);
router.delete("/rating/:comicId", authenticateToken, handleDeleteComicRating);
router.post("/bookmark/:comicId", authenticateToken, handleCreateComicBookmark);
router.delete(
  "/bookmark/:comicId",
  authenticateToken,
  handleDeleteComicBookmark
);

module.exports = router;
