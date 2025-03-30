const express = require("express");
const { authenticateToken } = require("../middleware");

const {
  handleCreateComment,
  handleCreateReplyComment,
  handleLikeDislikeComment,
  handleGetCommentByCommentId,
  handleGetCommentAndRepliesByCommentId,
  handleDeleteLikeDislikeComment,
} = require("../controllers/commentController.js");

const router = express.Router();

router.post("/", authenticateToken, handleCreateComment);
router.post("/reply", authenticateToken, handleCreateReplyComment);
router.get("/:commentId", handleGetCommentByCommentId);
router.get(
  "/:commentId/comment-replies",
  handleGetCommentAndRepliesByCommentId
);

router.post(
  "/:commentId/like-dislike",
  authenticateToken,
  handleLikeDislikeComment
);
router.delete(
  "/:commentId/like-dislike",
  authenticateToken,
  handleDeleteLikeDislikeComment
);

// router.get("/comic-comments/:comicId", handleGetAllCommentsByComicId);
// router.post("/reply-comment/:parentId", authenticateToken, handleReplyComment);
// router.post(
//   "/like-dislike/:commentId/:likeDislike",
//   authenticateToken,
//   handleLikeDislike
// );
// router.put(
//   "/like-dislike/:commentId/:likeDislike",
//   authenticateToken,
//   handleUpdateLikeDislike
// );
// router.delete(
//   "/like-dislike/:commentId",
//   authenticateToken,
//   handleDeleteLikeDislike
// );

module.exports = router;
