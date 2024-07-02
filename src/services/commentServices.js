const pool = require('../config/database');
const { convertToCamelCase } = require('../utils');

const getCommentById = async (commentId) => {
  try {
    const [commentsInfo] = await pool.query(
      'SELECT * FROM comments WHERE id = ?',
      [commentId]
    );

    return commentsInfo.length > 0 ? convertToCamelCase(commentsInfo[0]) : {};
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const getCommentByChapterId = async (chapterId) => {
  try {
    const [commentsInfo] = await pool.query(
      'SELECT * FROM comments WHERE chapter_id = ?',
      [chapterId]
    );

    return commentsInfo.length > 0 ? convertToCamelCase(commentsInfo[0]) : {};
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const createComment = async (content, comicId, userId) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO comments (content, comic_id, user_id) values(?, ?, ?)',
      [content, comicId, userId]
    );
    const newCommentId = result.insertId;

    return newCommentId;
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const createReplyComment = async (content, comicId, parentId, userId) => {
  try {
    const [result] = await pool.query(
      'INSERT INTO comments (content, comic_id, parent_id, user_id) values(?, ?, ?, ?)',
      [content, comicId, parentId, userId]
    );
    const newReplyId = result.insertId;

    return newReplyId;
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const getAllCommentsByComicId = async (comicId) => {
  try {
    const [allComments] = await pool.query(
      `WITH RECURSIVE CommentHierarchy AS (
        SELECT
            *,
            0 AS level
        FROM
            comments
        WHERE
            parent_id IS NULL and comic_id = ?
        UNION ALL
        SELECT
            c.*,
            ch.level + 1 AS level
        FROM
            comments c
        INNER JOIN
            CommentHierarchy ch ON c.parent_id = ch.id
      )
        SELECT
            *
        FROM
            CommentHierarchy
        ORDER BY
            publish_at DESC;`,
      [comicId]
    );

    const allStandardComments = [];

    const commentMap = new Map();
    allComments.forEach((comment) => {
      comment.replies = [];
      commentMap.set(comment.id, comment);
    });

    allComments.forEach((comment) => {
      if (comment.level === 0) {
        allStandardComments.push(comment);
      } else {
        let parentComment = commentMap.get(comment.parent_id);
        while (parentComment && parentComment.level !== 0) {
          parentComment = commentMap.get(parentComment.parent_id);
        }
        if (parentComment) {
          parentComment.replies.push(convertToCamelCase(comment));
        }
      }
    });

    // Sort comments and replies
    const compareReplies = (a, b) => {
      if (a.level !== b.level) {
        return a.level - b.level;
      } else {
        return new Date(a.publish_at) - new Date(b.publish_at);
      }
    };

    allComments.forEach((comment) => {
      comment.replies.sort(compareReplies);
    });

    return convertToCamelCase(allStandardComments);
  } catch (error) {
    console.log('Error: ', error);
    return [];
  }
};

const getLikesByCommentId = async (commentId) => {
  try {
    const [likes] = await pool.query(
      'SELECT * FROM likes_dislikes_comment WHERE comment_id = ? AND like_dislike = 1',
      [commentId]
    );

    return likes.length > 0 ? convertToCamelCase(likes) : [];
  } catch (error) {
    console.log('Error: ', error);
    return 0;
  }
};

const getDislikesByCommentId = async (commentId) => {
  try {
    const [dislikes] = await pool.query(
      'SELECT * FROM likes_dislikes_comment WHERE comment_id = ? AND like_dislike = 0',
      [commentId]
    );

    return dislikes.length > 0 ? convertToCamelCase(dislikes) : [];
  } catch (error) {
    console.log('Error: ', error);
    return 0;
  }
};

const createLikeDislike = async (commentId, userId, likeDislike) => {
  try {
    await pool.query(
      'INSERT INTO likes_dislikes_comment (comment_id, user_id, like_dislike) values(?, ?, ?)',
      [commentId, userId, likeDislike]
    );

    return true;
  } catch (error) {
    console.log('Error: ', error);
    return false;
  }
};

const deleteLikeDislike = async (commentId, userId) => {
  try {
    await pool.query(
      'DELETE FROM likes_dislikes_comment WHERE comment_id = ? AND user_id = ?',
      [commentId, userId]
    );

    return true;
  } catch (error) {
    console.log('Error: ', error);
    return false;
  }
};

const updateLikeDislike = async (commentId, userId, likeDislike) => {
  try {
    await pool.query(
      'UPDATE likes_dislikes_comment SET like_dislike = ? WHERE comment_id = ? AND user_id = ?',
      [likeDislike, commentId, userId]
    );

    return true;
  } catch (error) {
    console.log('Error: ', error);
    return false;
  }
};

module.exports = {
  createComment,
  getCommentById,
  createLikeDislike,
  updateLikeDislike,
  deleteLikeDislike,
  createReplyComment,
  getLikesByCommentId,
  getCommentByChapterId,
  getDislikesByCommentId,
  getAllCommentsByComicId,
};
