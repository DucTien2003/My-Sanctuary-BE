const jwt = require("jsonwebtoken");
const { getUserById, getUsersByIds } = require("../services/userServices");

const { getChaptersByIds } = require("../services/chapterServices");

const {
  createComment,
  getCommentById,
  createLikeDislike,
  updateLikeDislike,
  deleteLikeDislike,
  createReplyComment,
  getLikesByCommentId,
  getDislikesByCommentId,
  getAllCommentsByComicId,
} = require("../services/commentServices");

const handleComment = async (req, res) => {
  const userId = req.id;
  const comicId = req.body.comicId;
  const content = req.body.content;

  Promise.all([createComment(content, comicId, userId), getUserById(userId)])
    .then(async (values) => {
      const [resultCreateComment, userInfo] = values;

      if (!resultCreateComment.success) {
        return res.status(500).json({ message: "Error when create comment" });
      }

      const commentInfo = await getCommentById(
        resultCreateComment.newCommentId
      );
      return res.json({ ...commentInfo, user: userInfo });
    })
    .catch((error) => {
      console.log("Error: ", error);
      return res.status(500).json({});
    });
};

const handleReplyComment = async (req, res) => {
  const userId = req.id;
  const content = req.body.content;
  const comicId = req.body.comicId;
  const parentId = req.params.parentId;

  Promise.all([
    createReplyComment(content, comicId, parentId, userId),
    getUserById(userId),
  ])
    .then(async (values) => {
      const [resultCreateReply, userInfo] = values;
      if (!resultCreateReply.success) {
        return res.status(500).json({ message: "Error when create reply" });
      }

      const commentInfo = await getCommentById(resultCreateReply.newCommentId);
      return res.json({ ...commentInfo, user: userInfo });
    })
    .catch((error) => {
      console.log("Error: ", error);
      return res.status(500).json({});
    });
};

const handleGetAllCommentsByComicId = async (req, res) => {
  const comicId = req.params.comicId;

  const token = req.headers.token;
  let authId = null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      authId = payload.id;
    } catch (err) {
      authId = null;
    }
  }

  try {
    let comments = await getAllCommentsByComicId(comicId);

    const commentPromises = comments.map(async (comment) => {
      const [commentLikes, commentDislikes] = await Promise.all([
        getLikesByCommentId(comment.id),
        getDislikesByCommentId(comment.id),
      ]);

      comment.likes = commentLikes.length;
      comment.dislikes = commentDislikes.length;
      comment.authLiked = commentLikes.some((like) => like.userId === authId);
      comment.authDisliked = commentDislikes.some(
        (dislike) => dislike.userId === authId
      );

      const replyPromises = comment.replies.map(async (reply) => {
        const [replyLikes, replyDislikes] = await Promise.all([
          getLikesByCommentId(reply.id),
          getDislikesByCommentId(reply.id),
        ]);

        reply.likes = replyLikes.length;
        reply.dislikes = replyDislikes.length;
        reply.authLiked = replyLikes.some((like) => like.userId === authId);
        reply.authDisliked = replyDislikes.some(
          (dislike) => dislike.userId === authId
        );

        return reply;
      });

      comment.replies = await Promise.all(replyPromises);
      return comment;
    });

    comments = await Promise.all(commentPromises);

    const userIds = new Set();
    const chapterIds = new Set();
    comments.forEach((comment) => {
      userIds.add(comment.userId);
      chapterIds.add(comment.chapterId);

      comment.replies.forEach((reply) => {
        userIds.add(reply.userId);
      });
    });

    const uniqueUserIds = Array.from(userIds);
    const uniqueChapterIds = Array.from(chapterIds);

    const [usersInfo, chaptersInfo] = await Promise.all([
      getUsersByIds(uniqueUserIds),
      getChaptersByIds(uniqueChapterIds),
    ]);

    const userMap = new Map();
    usersInfo.forEach((user) => {
      userMap.set(user.id, user);
    });

    const listComments = comments.map((comment) => ({
      ...comment,
      user: userMap.get(comment.userId),
      chapter: chaptersInfo.find((chapter) => chapter.id === comment.chapterId),
      replies: comment.replies.map((reply) => ({
        ...reply,
        user: userMap.get(reply.userId),
      })),
    }));

    return res.json(listComments);
  } catch (error) {
    console.log("Error handleGetAllCommentsByComicId: ", error);
    return res.status(500).json([]);
  }
};

const handleLikeDislike = async (req, res) => {
  const userId = req.id;
  const commentId = req.params.commentId;
  const likeDislike = req.params.likeDislike;

  try {
    const result = await createLikeDislike(commentId, userId, likeDislike);
    return res.json(result);
  } catch (error) {
    console.log("Error handleLikeDislike: ", error);
    return res.status(500).json({});
  }
};

const handleUpdateLikeDislike = async (req, res) => {
  const userId = req.id;
  const commentId = req.params.commentId;
  const likeDislike = req.params.likeDislike;

  try {
    const result = await updateLikeDislike(commentId, userId, likeDislike);
    return res.json(result);
  } catch (error) {
    console.log("Error handleUpdateLikeDislike: ", error);
    return res.status(500).json({});
  }
};

const handleDeleteLikeDislike = async (req, res) => {
  const userId = req.id;
  const commentId = req.params.commentId;

  try {
    const result = await deleteLikeDislike(commentId, userId);
    return res.json(result);
  } catch (result) {
    console.log("Error handleDeleteLikeDislike: ", error);
    return res.status(500).json({});
  }
};

module.exports = {
  handleComment,
  handleLikeDislike,
  handleReplyComment,
  handleUpdateLikeDislike,
  handleDeleteLikeDislike,
  handleGetAllCommentsByComicId,
};
