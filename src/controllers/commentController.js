const jwt = require("jsonwebtoken");
const {
  getUserByUserId,
  getUsersByUserIds,
} = require("../services/userServices");

const services = require("../services");

const handleCreateComment = async (req, res) => {
  const commentInfo = {
    userId: req.id,
    content: req.body.content,
    comicId: req.body.comicId,
    chapterId: req.body.chapterId,
  };

  try {
    const { code, success, message, ...data } =
      await services.createCommentService(commentInfo);

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleCreateComment: ", error.message);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleCreateReplyComment = async (req, res) => {
  const commentInfo = {
    userId: req.id,
    content: req.body.content,
    comicId: req.body.comicId,
    chapterId: req.body.chapterId,
    parentRightValue: req.body.parentRightValue,
  };

  try {
    const { code, success, message, ...data } =
      await services.createReplyCommentService(commentInfo);

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleCreateReplyComment: ", error.message);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleLikeDislikeComment = async (req, res) => {
  const userId = req.id;
  const commentId = req.params.commentId;
  const likeDislike = req.body.likeDislike;

  try {
    const { code, success, message, ...data } =
      await services.createOrUpdateLikeDislikeByUserForCommentService({
        userId,
        commentId,
        likeDislike,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleLikeDislikeComment: ", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleGetCommentByCommentId = async (req, res) => {
  const commentId = req.params.commentId;

  try {
    const { code, success, message, ...data } =
      await services.getCommentByCommentIdService({ commentId });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleGetCommentByCommentId: ", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleGetCommentAndRepliesByCommentId = async (req, res) => {
  const commentId = req.params.commentId;
  const comicId = req.query.comicId;

  try {
    const { code, success, message, ...data } =
      await services.getCommentAndRepliesByCommentIdService({
        commentId,
        comicId,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (error) {
    console.log("Error handleGetCommentAndRepliesByCommentId: ", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

const handleDeleteLikeDislikeComment = async (req, res) => {
  const userId = req.id;
  const commentId = req.params.commentId;

  try {
    const { code, success, message, ...data } =
      await services.deleteLikeDislikeByUserForCommentService({
        userId,
        commentId,
      });

    return res.status(code).json({ code, success, message, data });
  } catch (result) {
    console.log("Error handleDeleteLikeDislikeComment: ", error);
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống, vui lòng thử lại sau" });
  }
};

module.exports = {
  handleCreateComment,
  handleCreateReplyComment,
  handleLikeDislikeComment,
  handleGetCommentByCommentId,
  handleGetCommentAndRepliesByCommentId,
  handleDeleteLikeDislikeComment,
};
