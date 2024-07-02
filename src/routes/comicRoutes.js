const express = require('express');

const authenticateToken = require('../middleware/authenticateToken.js');

const {
  handleGetComicById,
  handleCreateComicRating,
  handleUpdateComicRating,
  handleDeleteComicRating,
  handleCreateComicBookmark,
  handleDeleteComicBookmark,
} = require('../controllers/comicController.js');

const router = express.Router();

router.get('/:comicId', authenticateToken, handleGetComicById);
router.put('/rating/:comicId', authenticateToken, handleUpdateComicRating);
router.post('/rating/:comicId', authenticateToken, handleCreateComicRating);
router.delete('/rating/:comicId', authenticateToken, handleDeleteComicRating);
router.post('/bookmark/:comicId', authenticateToken, handleCreateComicBookmark);
router.delete(
  '/bookmark/:comicId',
  authenticateToken,
  handleDeleteComicBookmark
);

module.exports = router;
