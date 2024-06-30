const express = require('express');
const authenticateToken = require('../middleware/authenticateToken.js');

const {
  handleComment,
  handleLikeDislike,
  handleReplyComment,
  handleUpdateLikeDislike,
  handleDeleteLikeDislike,
  handleGetAllCommentsByComicId,
} = require('../controllers/commentController.js');

const router = express.Router();

router.post('', authenticateToken, handleComment);
router.get('/comic-comments/:comicId', handleGetAllCommentsByComicId);
router.post('/reply-comment/:parentId', authenticateToken, handleReplyComment);
router.post(
  '/like-dislike/:commentId/:likeDislike',
  authenticateToken,
  handleLikeDislike
);
router.put(
  '/like-dislike/:commentId/:likeDislike',
  authenticateToken,
  handleUpdateLikeDislike
);
router.delete(
  '/like-dislike/:commentId',
  authenticateToken,
  handleDeleteLikeDislike
);

module.exports = router;
