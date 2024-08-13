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

const getComicsByUserId = async (userId) => {
  try {
    const [comics, fields] = await pool.query(
      `SELECT * FROM comics WHERE user_id = ?`,
      [userId]
    );

    return comics.length > 0 ? convertToCamelCase(comics) : [];
  } catch (error) {
    console.log('Error: ', error);
    return [];
  }
};

const createComic = async (comic) => {
  try {
    const [result, fields] = await pool.query(
      `INSERT INTO comics (name, sub_name, cover, status, author, translator, description, name_minio, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        comic.name,
        comic.subName,
        comic.cover,
        comic.status,
        comic.author,
        comic.translator,
        comic.description,
        comic.nameMinio,
        comic.userId,
      ]
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    const newComicId = result.insertId;

    return { success: true, newComicId: newComicId };
  } catch (error) {
    console.log('Error createComic: ', error);
    return { success: false };
  }
};

const updateComic = async (comic) => {
  try {
    const [result, fields] = await pool.query(
      `UPDATE comics SET name = ?, sub_name = ?, cover = ?, status = ?, author = ?, translator = ?, description = ?, name_minio = ? WHERE id = ?`,
      [
        comic.name,
        comic.subName,
        comic.cover,
        comic.status,
        comic.author,
        comic.translator,
        comic.description,
        comic.nameMinio,
        comic.id,
      ]
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log('Error updateComic: ', error);
    return { success: false };
  }
};

const deleteComicByComicId = async (comicId) => {
  try {
    const [result, fields] = await pool.query(
      `DELETE FROM comics WHERE id = ?`,
      [comicId]
    );

    return { success: true };
  } catch (error) {
    console.log('Error deleteComicByComicId: ', error);
    return { success: false };
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
    const result = await pool.query(
      `INSERT INTO comic_ratings (user_id, comic_id, rating) VALUES (?, ?, ?)`,
      [userId, comicId, rating]
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log('Error createComicRating: ', error);
    return { success: false };
  }
};

const updateComicRating = async (comicId, userId, rating) => {
  try {
    const [result] = await pool.query(
      `UPDATE comic_ratings SET rating = ? WHERE user_id = ? AND comic_id = ?`,
      [rating, userId, comicId]
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log('Error updateComicRating: ', error);
    return { success: false };
  }
};

const deleteComicRating = async (comicId, userId) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM comic_ratings WHERE user_id = ? AND comic_id = ?`,
      [userId, comicId]
    );

    return { success: true };
  } catch (error) {
    console.log('Error deleteComicRating: ', error);
    return { success: false };
  }
};

const getComicBookmarkByUserId = async (comicId, userId) => {
  try {
    const [comicBookmark, fields] = await pool.query(
      `SELECT * FROM bookmark_comics_users WHERE user_id = ? AND comic_id = ?`,
      [userId, comicId]
    );

    return comicBookmark.length > 0 ? convertToCamelCase(comicBookmark[0]) : {};
  } catch (error) {
    console.log('Error getComicBookmarkByUserId: ', error);
    return {};
  }
};

const createComicBookmark = async (comicId, userId) => {
  try {
    const [result, fields] = await pool.query(
      `INSERT INTO bookmark_comics_users (user_id, comic_id) VALUES (?, ?)`,
      [userId, comicId]
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log('Error createComicBookmark: ', error);
    return { success: false };
  }
};

const deleteComicBookmark = async (comicId, userId) => {
  try {
    const [result, fields] = await pool.query(
      `DELETE FROM bookmark_comics_users WHERE user_id = ? AND comic_id = ?`,
      [userId, comicId]
    );

    return { success: true };
  } catch (error) {
    console.log('Error deleteComicBookmark: ', error);
    return { success: false };
  }
};

const getGenresByComicId = async (comicId) => {
  try {
    const [genres, fields] = await pool.query(
      `SELECT gen.* FROM genres gen
      INNER JOIN comics_genres cg ON gen.id = cg.genre_id
      WHERE cg.comic_id = ?
      ORDER BY gen.title ASC`,
      [comicId]
    );

    return genres.length > 0 ? convertToCamelCase(genres) : [];
  } catch (error) {
    console.log('Error getGenresByComicId: ', error);
    return [];
  }
};

const getAllGenres = async () => {
  try {
    const [genres, fields] = await pool.query(
      `SELECT * FROM genres ORDER BY title ASC`
    );

    return genres.length > 0 ? convertToCamelCase(genres) : [];
  } catch (error) {
    console.log('Error getAllGenres: ', error);
    return [];
  }
};

const createGenresComics = async (comicId, genres) => {
  try {
    if (genres.length === 0) return { success: true };

    const values = genres
      .map((genreId) => `(${comicId}, ${genreId})`)
      .join(', ');
    const [result] = await pool.query(
      `INSERT INTO comics_genres (comic_id, genre_id) VALUES ${values}`
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log('Error createGenresComics: ', error);
    return { success: false };
  }
};

const updateGenresComics = async (comicId, genres) => {
  try {
    await pool.query(`DELETE FROM comics_genres WHERE comic_id = ?`, [comicId]);

    const values = genres
      .map((genreId) => `(${comicId}, ${genreId})`)
      .join(', ');

    const [result] = await pool.query(
      `INSERT INTO comics_genres (comic_id, genre_id) VALUES ${values}`
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log('Error updateGenresComics: ', error);
    return { success: false };
  }
};

const deleteGenresComics = async (comicId) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM comics_genres WHERE comic_id = ?`,
      [comicId]
    );

    return { success: true };
  } catch (error) {
    console.log('Error deleteGenresComics: ', error);
    return { success: false };
  }
};

const getListComics = async ({
  limit = 0,
  orderBy = 'publish_at',
  ascending = false,
  page = 0,
}) => {
  try {
    const validOrderByColumns = [
      'views',
      'rating',
      'bookmarks',
      'update_at',
      'publish_at',
    ];
    if (!validOrderByColumns.includes(orderBy)) {
      throw new Error(`Invalid orderBy column: ${orderBy}`);
    }

    const orderDirection = ascending ? 'ASC' : 'DESC';
    const offset = page * limit;

    const [comics, fields] = await pool.query(
      `SELECT * FROM comics ORDER BY ${orderBy} ${orderDirection} LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return comics.length > 0 ? convertToCamelCase(comics) : [];
  } catch (error) {
    console.log('Error: ', error);
    return [];
  }
};

module.exports = {
  createComic,
  updateComic,
  getAllGenres,
  getComicById,
  getListComics,
  getComicsByUserId,
  createComicRating,
  updateComicRating,
  deleteComicRating,
  createGenresComics,
  updateGenresComics,
  deleteGenresComics,
  getGenresByComicId,
  createComicBookmark,
  deleteComicBookmark,
  deleteComicByComicId,
  getComicRatingByUserId,
  getComicBookmarkByUserId,
};
