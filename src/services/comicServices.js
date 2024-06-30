const pool = require('../config/database');
const { convertToCamelCase } = require('../utils');

const getComicById = async (comicId) => {
  try {
    const [comic, fields] = await pool.query(
      `SELECT * FROM comics WHERE id = ?`,
      [comicId]
    );

    return comic.length > 0 ? convertToCamelCase(comic[0]) : {};
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const getComicRatingByUserId = async (comicId, userId) => {
  try {
    const [comicRating, fields] = await pool.query(
      `SELECT * FROM comic_ratings WHERE user_id = ? AND comic_id = ?`,
      [userId, comicId]
    );

    return comicRating.length > 0 ? convertToCamelCase(comicRating[0]) : {};
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const createComicRating = async (comicId, userId, rating) => {
  try {
    const [result, fields] = await pool.query(
      `INSERT INTO comic_ratings (user_id, comic_id, rating) VALUES (?, ?, ?)`,
      [userId, comicId, rating]
    );

    return result;
  } catch (error) {
    console.log('Error createComicRating: ', error);
    return {};
  }
};

const updateComicRating = async (comicId, userId, rating) => {
  try {
    const [result, fields] = await pool.query(
      `UPDATE comic_ratings SET rating = ? WHERE user_id = ? AND comic_id = ?`,
      [rating, userId, comicId]
    );

    return result;
  } catch (error) {
    console.log('Error updateComicRating: ', error);
    return {};
  }
};

const deleteComicRating = async (comicId, userId) => {
  try {
    const [result, fields] = await pool.query(
      `DELETE FROM comic_ratings WHERE user_id = ? AND comic_id = ?`,
      [userId, comicId]
    );

    return result;
  } catch (error) {
    console.log('Error deleteComicRating: ', error);
    return {};
  }
};

module.exports = {
  getComicById,
  createComicRating,
  updateComicRating,
  deleteComicRating,
  getComicRatingByUserId,
};
