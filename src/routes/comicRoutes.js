const express = require('express');

const authenticateToken = require('../middleware/authenticateToken.js');

const {
  handleGetComicById,
  handleCreateComicRating,
  handleUpdateComicRating,
  handleDeleteComicRating,
} = require('../controllers/comicController.js');

const router = express.Router();

router.get('/:comicId', authenticateToken, handleGetComicById);
router.post('/rating/:comicId', authenticateToken, handleCreateComicRating);
router.put('/rating/:comicId', authenticateToken, handleUpdateComicRating);
router.delete('/rating/:comicId', authenticateToken, handleDeleteComicRating);

module.exports = router;
