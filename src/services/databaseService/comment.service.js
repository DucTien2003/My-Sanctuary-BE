const { Sequelize } = require("sequelize");
const { Comment } = require("../../models");
const { isEmpty, convertToCamelCase } = require("../../utils");
const { create } = require("lodash");

const getCommentByCommentId = async ({ commentId }) => {
  const comment = await Comment.findByPk(commentId);

  return !isEmpty(comment)
    ? { comment: convertToCamelCase(comment.dataValues) }
    : { comment: {} };
};

const getCommentAndRepliesByCommentId = async ({ commentId, comicId }) => {
  const commentData = await Comment.findByPk(commentId);

  // Get reply comments
  const minLeftValue = commentData.left_value;
  const maxRightValue = commentData.right_value;

  const { count, rows: commentsResult } = await Comment.findAndCountAll({
    where: {
      comic_id: comicId,
      left_value: {
        [Sequelize.Op.between]: [minLeftValue, maxRightValue],
      },
    },
    order: [["left_value", "ASC"]],
  });

  const comments = commentsResult.map((comment) => comment.dataValues);

  return !isEmpty(comments)
    ? { comments: convertToCamelCase(comments), count }
    : { comments: [], count: 0 };
};

const createComment = async ({ userId, content, comicId, chapterId }) => {
  // Tìm giá trị right_value lớn nhất trong bảng
  const maxRightValueResult = await Comment.findOne({
    attributes: [
      [Sequelize.fn("MAX", Sequelize.col("right_value")), "maxRightValue"],
    ],
  });

  const maxRightValue = maxRightValueResult.get("maxRightValue") || 0;

  // Tạo bình luận mới với left_value và right_value tính toán được
  const newComment = await Comment.create({
    content: content,
    left_value: maxRightValue + 1,
    right_value: maxRightValue + 2,
    user_id: userId,
    comic_id: comicId,
    chapter_id: chapterId,
    likes: 0,
    dislikes: 0,
  });

  return !isEmpty(newComment)
    ? { comment: convertToCamelCase(newComment.dataValues), created: true }
    : { comment: {}, created: false };
};

const createReplyComment = async ({
  userId,
  content,
  comicId,
  chapterId,
  parentRightValue,
}) => {
  // Tăng `right_value` cho tất cả các bình luận có `right_value` lớn hơn hoặc bằng `parentRightValue`.
  await Comment.update(
    { right_value: Sequelize.literal("right_value + 2") },
    { where: { right_value: { [Sequelize.Op.gte]: parentRightValue } } }
  );

  // Tăng `left_value` cho tất cả các bình luận có `left_value` lớn hơn `parentRightValue`.
  await Comment.update(
    { left_value: Sequelize.literal("left_value + 2") },
    { where: { left_value: { [Sequelize.Op.gt]: parentRightValue } } }
  );

  const newComment = await Comment.create({
    content: content,
    left_value: parentRightValue,
    right_value: parentRightValue + 1,
    user_id: userId,
    comic_id: comicId,
    chapter_id: chapterId || null,
    root: false,
    likes: 0,
    dislikes: 0,
  });

  return !isEmpty(newComment)
    ? { comment: convertToCamelCase(newComment.dataValues), created: true }
    : { comment: {}, created: false };
};

const getCommentsByComicId = async ({
  comicId,
  limit,
  page,
  orderBy,
  sortType,
}) => {
  // Get root comments
  const { count, rows: rootCommentsResult } = await Comment.findAndCountAll({
    where: {
      comic_id: comicId,
      root: true,
    },
    order: [["left_value", "DESC"]],
    limit,
    offset: limit > 0 ? (page - 1) * limit : undefined,
  });

  if (rootCommentsResult.length === 0) {
    return { count: 0, comments: [] };
  }

  const rootComments = rootCommentsResult.map((comment) => comment.dataValues);

  // Get reply comments
  const minLeftValue = rootComments[rootComments.length - 1].left_value;
  const maxRightValue = rootComments[0].right_value;

  const allCommentsResult = await Comment.findAll({
    where: {
      comic_id: comicId,
      left_value: {
        [Sequelize.Op.between]: [minLeftValue, maxRightValue],
      },
    },
    order: [["left_value", "DESC"]],
  });

  const allComments = allCommentsResult.map((comment) => comment.dataValues);

  return !isEmpty(allComments)
    ? { count, comments: convertToCamelCase(allComments) }
    : { count: 0, comments: [] };
};

const getCommentsByChapterId = async ({
  chapterId,
  comicId,
  limit = 5,
  page = 0,
}) => {
  // Get root comments
  const { count, rows: rootComments } = await Comment.findAndCountAll({
    where: {
      comic_id: comicId,
      chapter_id: chapterId,
      root: true,
    },
    order: [["left_value", "ASC"]],
    limit,
    offset: limit > 0 ? (page - 1) * limit : undefined,
  });

  if (rootComments.length === 0) {
    return { count: 0, comments: [] };
  }

  // Get reply comments
  const minLeftValue = rootComments[0].left_value;
  const maxRightValue = rootComments[rootComments.length - 1].right_value;

  const allComments = await Comment.findAll({
    where: {
      comic_id: comicId,
      chapter_id: chapterId,
      left_value: {
        [Sequelize.Op.between]: [minLeftValue, maxRightValue],
      },
    },
    order: [["left_value", "ASC"]],
  });

  return !isEmpty(allComments)
    ? { count, comments: convertToCamelCase(allComments) }
    : { count: 0, comments: [] };
};

module.exports = {
  getCommentByCommentId,
  getCommentAndRepliesByCommentId,
  createComment,
  createReplyComment,
  getCommentsByComicId,
  getCommentsByChapterId,
};
