const pool = require('../config/database');
const minioClient = require('../config/minIO');

const { sortByLastNumber, convertToCamelCase } = require('../utils');

// List images in a chapter
const getImagesOfChapter = async (chapterId, recursive = true) => {
  try {
    const [infoMinIO, fields] = await pool.query(
      `SELECT
        comics.name_minio AS comic_name_minio,
        chapters.name_minio AS chapter_name_minio
      FROM
        chapters
      INNER JOIN
        comics ON chapters.comic_id = comics.id
      WHERE
        chapters.id = ?`,
      [chapterId]
    );

    if (infoMinIO.length === 0) return [];

    const images = [];
    const stream = minioClient.listObjects(
      infoMinIO[0].comic_name_minio,
      infoMinIO[0].chapter_name_minio + '/',
      recursive
    );

    for await (const obj of stream) {
      images.push(obj);
    }

    const imageNames = sortByLastNumber(images.map((object) => object.name));

    const imageUrlPromises = imageNames.map(async (name) => {
      const url = await minioClient.presignedGetObject(
        infoMinIO[0].comic_name_minio,
        name
      );

      return url;
    });

    const imageUrls = await Promise.all(imageUrlPromises);

    return convertToCamelCase(imageUrls);
  } catch (error) {
    console.log('Error: ', error);
    return [];
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
    console.log('Error: ', error);
    return {};
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

    return convertToCamelCase(chaptersInfo);
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const getAllChaptersByComicId = async (comicId) => {
  try {
    const [allChapters, fields] = await pool.query(
      `SELECT * FROM chapters WHERE comic_id = ? ORDER BY 'index' ASC`,
      [comicId]
    );

    return convertToCamelCase(allChapters);
  } catch (error) {
    console.log('Error: ', error);
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
    console.log('Error: ', error);
    return false;
  }
};

module.exports = {
  getChapterById,
  getChaptersByIds,
  getImagesOfChapter,
  updateChapterViews,
  getAllChaptersByComicId,
};
