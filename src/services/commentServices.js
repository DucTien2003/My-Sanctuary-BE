const databaseService = require("./databaseService");

// Utils
// Handle nested comments
const handleNestedComments = async (comments) => {
  if (comments.length === 0) {
    return [];
  }

  const promises = comments.map(async (comment) => {
    // Lấy thông tin người dùng
    const { user } = await databaseService.getUserByUserId({
      userId: comment.userId,
    });
    comment.user = { id: user.id, avatar: user.avatar, name: user.name };

    // Lấy thông tin like/dislike của người dùng đối với comment
    const { likeDislike: authLikeDislike } =
      await databaseService.getLikeDislikeByUserForComment({
        userId: comment.userId,
        commentId: comment.id,
      });

    if (authLikeDislike) {
      if (authLikeDislike.likeDislike === "like") {
        comment.authLiked = true;
      } else if (authLikeDislike.likeDislike === "dislike") {
        comment.authDisliked = true;
      }
    }

    comment.replies = [];
  });
  await Promise.all(promises);

  // Sắp xếp các comment theo thứ tự `leftValue` để duyệt theo thứ tự phân cấp
  comments.sort((a, b) => a.leftValue - b.leftValue);

  // Tạo một stack để theo dõi các node cha
  const roots = [comments[0]];
  let rightValueRoot = comments[0].rightValue;

  for (let i = 1; i < comments.length; i++) {
    // Nếu comment hiện tại là root
    // if (comments[i].rightValue === rightValueRoot) {
    //   roots.push(comments[i]);
    //   continue;
    // }

    // Nếu comment hiện tại là con của root
    if (roots.length > 0 && comments[i].rightValue < rightValueRoot) {
      roots[roots.length - 1].replies.push(comments[i]);
      continue;
    }

    // Nếu comment hiện tại là 1 comment khác
    if (roots.length > 0) {
      rightValueRoot = comments[i].rightValue;
      roots.push(comments[i]);
    }
  }

  return roots;
};

// Services
const getCommentByCommentIdService = async ({ commentId }) => {
  const { comment } = await databaseService.getCommentByCommentId({
    commentId,
  });

  // Get user info
  const { user } = await databaseService.getUserByUserId({
    userId: comment.userId,
  });
  comment.user = { id: user.id, avatar: user.avatar, name: user.name };

  // Get auth like/dislike info
  const { likeDislike: authLikeDislike } =
    await databaseService.getLikeDislikeByUserForComment({
      userId: comment.userId,
      commentId: comment.id,
    });

  if (authLikeDislike) {
    if (authLikeDislike.likeDislike === "like") {
      comment.authLiked = true;
    } else if (authLikeDislike.likeDislike === "dislike") {
      comment.authDisliked = true;
    }
  }

  return {
    code: 200,
    success: true,
    message: "Lấy bình luận thành công",
    comment,
  };
};

const getCommentAndRepliesByCommentIdService = async ({
  commentId,
  comicId,
}) => {
  const { comments, count } =
    await databaseService.getCommentAndRepliesByCommentId({
      commentId,
      comicId,
    });

  // Handle reply comments
  const nestedComments = await handleNestedComments(comments);

  return {
    code: 200,
    success: true,
    message: "Lấy bình luận thành công",
    comment: nestedComments.length > 0 ? nestedComments[0] : null,
    count,
  };
};

const createCommentService = async ({
  content,
  comicId,
  userId,
  chapterId,
}) => {
  const { comment, created } = await databaseService.createComment({
    userId,
    content,
    comicId,
    chapterId: chapterId || null,
  });

  return {
    code: 200,
    success: true,
    message: "Tạo bình luận thành công",
    comment,
  };
};

const createReplyCommentService = async ({
  userId,
  content,
  comicId,
  chapterId,
  parentRightValue,
}) => {
  const { comment, created } = await databaseService.createReplyComment({
    userId,
    content,
    comicId,
    chapterId,
    parentRightValue,
  });

  return {
    code: 200,
    success: true,
    message: "Tạo bình luận thành công",
    comment,
  };
};

const getCommentsByComicIdService = async ({
  comicId,
  limit = 0,
  page = 1,
  orderBy = "created_at",
  sortType = "ASC",
}) => {
  const { count, comments } = await databaseService.getCommentsByComicId({
    comicId,
    limit: Number(limit),
    page: page ? Number(page) : 1,
    orderBy,
    sortType,
  });

  // Handle reply comments
  const nestedComments = await handleNestedComments(comments);

  return {
    code: 200,
    success: true,
    message: "Lấy bình luận thành công",
    comments: nestedComments,
    count,
  };
};

const getCommentsByChapterIdService = async ({ chapterId }) => {
  const { count, comments } = await databaseService.getCommentsByChapterId({
    chapterId,
  });

  // Handle reply comments
  const nestedComments = await handleNestedComments(comments);

  return {
    code: 200,
    success: true,
    message: "Lấy bình luận thành công",
    comments: nestedComments,
    count,
  };
};

const createOrUpdateLikeDislikeByUserForCommentService = async ({
  userId,
  commentId,
  likeDislike,
}) => {
  const { likeDislikeResult, created } =
    await databaseService.createOrUpdateLikeDislikeByUserForComment({
      userId,
      commentId,
      likeDislike,
    });

  return {
    code: 200,
    success: true,
    message: "Tạo hoặc cập nhật like/dislike thành công",
    likeDislike: likeDislikeResult,
    created,
  };
};

const deleteLikeDislikeByUserForCommentService = async ({
  userId,
  commentId,
}) => {
  const { deleted } = await databaseService.deleteLikeDislikeByUserForComment({
    userId,
    commentId,
  });

  return {
    code: 200,
    success: true,
    message: "Xóa like/dislike thành công",
    deleted,
  };
};

const getLikeDislikeByUserForCommentService = async ({ userId, commentId }) => {
  const { likeDislike } = await databaseService.getLikeDislikeByUserForComment({
    userId,
    commentId,
  });

  return {
    code: 200,
    success: true,
    message: "Lấy like/dislike thành công",
    likeDislike,
  };
};

module.exports = {
  getCommentByCommentIdService,
  getCommentAndRepliesByCommentIdService,
  createCommentService,
  createReplyCommentService,
  getCommentsByComicIdService,
  getCommentsByChapterIdService,
  createOrUpdateLikeDislikeByUserForCommentService,
  deleteLikeDislikeByUserForCommentService,
  getLikeDislikeByUserForCommentService,
};
