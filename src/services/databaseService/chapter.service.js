const { Sequelize } = require("sequelize");
const { Chapter } = require("../../models");
const { isEmpty, convertToCamelCase } = require("../../utils");

const getChapterByChapterId = async ({ chapterId }) => {
  const chapter = await Chapter.findByPk(chapterId);

  return !isEmpty(chapter)
    ? { chapter: convertToCamelCase(chapter.dataValues) }
    : { chapter: {} };
};

const createChapter = async ({ chapterData }) => {
  const [chapter, created] = await Chapter.findOrCreate({
    where: {
      [Sequelize.Op.or]: [
        {
          comic_id: chapterData.comicId,
          number_order: chapterData.numberOrder,
        },
        {
          comic_id: chapterData.comicId,
          name_minio: chapterData.nameMinio,
        },
      ],
    },
    defaults: {
      name: chapterData.name,
      comic_id: chapterData.comicId,
      name_minio: chapterData.nameMinio,
      number_order: chapterData.numberOrder,
    },
  });

  return { chapter: convertToCamelCase(chapter.dataValues), created };
};

const updateChapterByChapterId = async ({ chapterData }) => {
  const [count] = await Chapter.update(
    {
      name: chapterData.name,
      number_order: chapterData.numberOrder,
      name_minio: chapterData.nameMinio,
    },
    {
      where: { id: chapterData.id },
    }
  );

  return { updated: count > 0 };
};

const deleteChapterByChapterId = async ({ chapterId }) => {
  const count = await Chapter.destroy({ where: { id: chapterId } });

  return { deleted: count > 0 };
};

const getChaptersByChapterIds = async ({
  chapterIds,
  page,
  limit,
  orderBy,
  sortType,
}) => {
  const { count, rows: chaptersResult } = await Chapter.findAndCountAll({
    where: { id: chapterIds },
    order: [[orderBy, sortType]],
    limit: limit > 0 ? limit : undefined, // chỉ áp dụng limit nếu limit > 0
    offset: limit > 0 ? (page - 1) * limit : undefined, // chỉ áp dụng offset nếu limit > 0
  });

  const chapters = chaptersResult.map((chapter) => chapter.dataValues);

  return !isEmpty(chapters)
    ? { count, chapters: convertToCamelCase(chapters) }
    : { count: 0, chapters: [] };
};

const updateChapterViewsByChapterId = async ({ chapterId }) => {
  const [count] = await Chapter.increment("views", {
    by: 1,
    where: { id: chapterId },
  });

  return { updated: count > 0 };
};

const checkChapterExistsByComicId = async ({ comicId }) => {
  const chapter = await Chapter.findOne({
    where: { comic_id: comicId },
  });

  return { existed: !isEmpty(chapter) };
};

const checkChapterIndexExistsByComicId = async ({ comicId, numberOrder }) => {
  const chapter = await Chapter.findOne({
    where: { comic_id: comicId, number_order: numberOrder },
  });

  return { existed: !isEmpty(chapter) };
};

const getLatestChapterByComicId = async ({ comicId }) => {
  const chapter = await Chapter.findOne({
    where: { comic_id: comicId },
    order: [["number_order", "DESC"]],
  });

  return !isEmpty(chapter)
    ? { chapter: convertToCamelCase(chapter.dataValues) }
    : { chapter: {} };
};

const getChaptersByComicId = async ({
  comicId,
  page,
  limit,
  orderBy,
  sortType,
}) => {
  const { count, rows: chaptersResult } = await Chapter.findAndCountAll({
    where: { comic_id: comicId },
    order: [[orderBy, sortType]],
    limit: limit > 0 ? limit : undefined, // chỉ áp dụng limit nếu limit > 0
    offset: limit > 0 && page > 0 ? (page - 1) * limit : undefined, // chỉ áp dụng offset nếu limit > 0 && page > 0
  });

  const chapters = chaptersResult.map((chapter) => chapter.dataValues);

  return !isEmpty(chapters)
    ? { count, chapters: convertToCamelCase(chapters) }
    : { count: 0, chapters: [] };
};

module.exports = {
  getChapterByChapterId,
  createChapter,
  updateChapterByChapterId,
  deleteChapterByChapterId,
  getChaptersByChapterIds,
  updateChapterViewsByChapterId,
  checkChapterExistsByComicId,
  checkChapterIndexExistsByComicId,
  getLatestChapterByComicId,
  getChaptersByComicId,
};
