const { LikeDislikeComment } = require("../../models");
const { convertToCamelCase, isEmpty } = require("../../utils");

const createOrUpdateLikeDislikeByUserForComment = async ({
  userId,
  commentId,
  likeDislike,
}) => {
  const [likeDislikeInfo, created] = await LikeDislikeComment.upsert({
    user_id: userId,
    comment_id: commentId,
    like_dislike: likeDislike,
  });

  return {
    likeDislike: convertToCamelCase(likeDislikeInfo.dataValues),
    created,
  };
};

const deleteLikeDislikeByUserForComment = async ({ userId, commentId }) => {
  const count = await LikeDislikeComment.destroy({
    where: { user_id: userId, comment_id: commentId },
  });

  return { deleted: count > 0 };
};

const getLikeDislikeByUserForComment = async ({ userId, commentId }) => {
  const likeDislikeResult = await LikeDislikeComment.findOne({
    where: { user_id: userId, comment_id: commentId },
  });

  if (!likeDislikeResult) {
    return { likeDislike: {} };
  }

  const likeDislike = convertToCamelCase(likeDislikeResult.dataValues);

  return !isEmpty(likeDislike) ? { likeDislike } : { likeDislike: {} };
};

module.exports = {
  createOrUpdateLikeDislikeByUserForComment,
  deleteLikeDislikeByUserForComment,
  getLikeDislikeByUserForComment,
};
