const pool = require('../config/database');
const minioClient = require('../config/minIO');

const { sortByLastNumber } = require('../utils');

// List images in a chapter
const getImagesOfChapter = async (chapterID, recursive = true) => {
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
      [chapterID]
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

    return imageUrls;
  } catch (error) {
    console.log('Error: ', error);
    return [];
  }
};

const getChapterById = async (chapterID) => {
  try {
    const [chapterInfo] = await pool.query(
      'SELECT * FROM chapters WHERE id = ?',
      [chapterID]
    );

    return chapterInfo.length > 0 ? chapterInfo[0] : {};
  } catch (error) {
    console.log('Error: ', error);
    return {};
  }
};

const getAllChaptersByComicId = async (comicID) => {
  try {
    const [allChapters, fields] = await pool.query(
      `SELECT * FROM chapters WHERE comic_id = ? ORDER BY 'index' ASC`,
      [comicID]
    );

    return allChapters;
  } catch (error) {
    console.log('Error: ', error);
    return [];
  }
};

module.exports = {
  getImagesOfChapter,
  getChapterById,
  getAllChaptersByComicId,
};
