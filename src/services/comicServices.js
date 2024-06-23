const pool = require('../config/database');

const getComicById = async (comicID) => {
  try {
    const [comic, fields] = await pool.query(
      `SELECT * FROM comics WHERE id = ?`,
      [comicID]
    );

    return comic.length > 0 ? comic[0] : {};
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

module.exports = {
  getComicById,
};
