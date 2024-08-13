const pool = require('../config/database');
const { convertToCamelCase } = require('../utils');

const getImagesByChapterId = async (chapterId) => {
  try {
    const [images] = await pool.query(
      `SELECT * FROM images WHERE chapter_id = ? ORDER BY \`index\` ASC`,
      [chapterId]
    );

    return images.length > 0 ? convertToCamelCase(images) : [];
  } catch (error) {
    console.log('Error getImagesByChapterId: ', error);
    return [];
  }
};

const createImages = async (imagesInfo) => {
  const query =
    `INSERT INTO images (\`index\`, url, chapter_id) VALUES ` +
    imagesInfo.map(() => '(?, ?, ?)').join(', ');

  try {
    const [result] = await pool.query(
      query,
      imagesInfo
        .map((imageInfo) => [
          imageInfo.index,
          imageInfo.url,
          imageInfo.chapterId,
        ])
        .flat()
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log('Error createImage: ', error);
    return { success: false };
  }
};

const deleteImagesByChapterId = async (chapterId) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM images WHERE chapter_id = ?`,
      [chapterId]
    );

    return { success: true };
  } catch (error) {
    console.log('Error deleteImagesByChapterId: ', error);
    return { success: false };
  }
};

const getChapterById = async (chapterId) => {
  try {
    const [chapterInfo] = await pool.query(
      'SELECT * FROM chapters WHERE id = ?',
      [chapterId]
    );

    return chapterInfo.length > 0 ? convertToCamelCase(chapterInfo[0]) : {};
  } catch (error) {
    console.log('Error getChapterById: ', error);
    return {};
  }
};

const createChapter = async (chapterInfo) => {
  try {
    const [result] = await pool.query(
      `INSERT INTO chapters (name, \`index\`, name_minio, comic_id) VALUES (?, ?, ?, ?)`,
      [
        chapterInfo.name,
        chapterInfo.index,
        chapterInfo.nameMinio,
        chapterInfo.comicId,
      ]
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true, insertId: result.insertId };
  } catch (error) {
    console.log('Error createChapter: ', error);
    return { success: false };
  }
};

const updateChapterByChapterId = async (chapterInfo) => {
  try {
    const [result] = await pool.query(
      `UPDATE chapters SET name = ?, \`index\` = ?, name_minio = ? WHERE id = ?`,
      [
        chapterInfo.name,
        chapterInfo.index,
        chapterInfo.nameMinio,
        chapterInfo.id,
      ]
    );

    if (result.affectedRows === 0) {
      return { success: false };
    }

    return { success: true };
  } catch (error) {
    console.log('Error updateChapterByChapterId: ', error);
    return { success: false };
  }
};

const deleteChapterByChapterId = async (chapterId) => {
  try {
    const [result] = await pool.query(`DELETE FROM chapters WHERE id = ?`, [
      chapterId,
    ]);

    return { success: true };
  } catch (error) {
    console.log('Error deleteChapterByChapterId: ', error);
    return { success: false };
  }
};

const getChaptersByIds = async (chapterIds) => {
  if (chapterIds.length === 0) {
    return [];
  }

  const placeholders = chapterIds.map(() => '?').join(', ');
  try {
    const [chaptersInfo] = await pool.query(
      `SELECT * FROM chapters WHERE id IN (${placeholders})`,
      chapterIds
    );

    return chaptersInfo.length > 0 ? convertToCamelCase(chaptersInfo) : [];
  } catch (error) {
    console.log('Error getChaptersByIds: ', error);
    return [];
  }
};

const getAllChaptersByComicId = async (comicId) => {
  try {
    const [allChapters, fields] = await pool.query(
      `SELECT * FROM chapters WHERE comic_id = ? ORDER BY \`index\` ASC`,
      [comicId]
    );

    return convertToCamelCase(allChapters);
  } catch (error) {
    console.log('Error getAllChaptersByComicId: ', error);
    return [];
  }
};

const updateChapterViews = async (chapterId) => {
  try {
    const [updateResult] = await pool.query(
      `UPDATE chapters SET views = views + 1 WHERE id = ?`,
      [chapterId]
    );

    return updateResult.affectedRows > 0;
  } catch (error) {
    console.log('Error updateChapterViews: ', error);
    return false;
  }
};

const checkChapterIndexExists = async (comicId, index) => {
  try {
    const [chapterInfo] = await pool.query(
      `SELECT * FROM chapters WHERE comic_id = ? and \`index\` = ?`,
      [comicId, index]
    );

    return chapterInfo.length > 0;
  } catch (error) {
    console.log('Error checkChapterExists: ', error);
    return false;
  }
};

const checkChapterExistsByComicId = async (comicId) => {
  try {
    const [chaptersInfo] = await pool.query(
      `SELECT * FROM chapters WHERE comic_id = ?`,
      [comicId]
    );

    return chaptersInfo.length > 0;
  } catch (error) {
    console.log('Error checkChapterExistsByComicId: ', error);
    return false;
  }
};

const getLatestChapter = async (comicId) => {
  try {
    const [chapterInfo] = await pool.query(
      'SELECT * FROM chapters WHERE comic_id = ? ORDER BY `index` DESC LIMIT 1',
      [comicId]
    );

    return chapterInfo.length > 0 ? convertToCamelCase(chapterInfo[0]) : {};
  } catch (error) {
    console.log('Error checkChapterExistsByComicId: ', error);
    return {};
  }
};

module.exports = {
  createImages,
  createChapter,
  getChapterById,
  getLatestChapter,
  getChaptersByIds,
  updateChapterViews,
  getImagesByChapterId,
  checkChapterIndexExists,
  deleteImagesByChapterId,
  getAllChaptersByComicId,
  updateChapterByChapterId,
  deleteChapterByChapterId,
  checkChapterExistsByComicId,
};
