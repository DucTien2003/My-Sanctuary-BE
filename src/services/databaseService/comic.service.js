const { Op, Sequelize } = require("sequelize");
const { isEmpty, convertToCamelCase } = require("../../utils");
const { Comic } = require("../../models");
const { Genre } = require("../../models");
const { BookmarkComicUser } = require("../../models");

const getComics = async ({
  page = 1,
  limit = 0,
  genres = "",
  search = "",
  order = "DESC",
  status = "all",
  orderBy = "created_at",
}) => {
  const genreIds = genres ? genres.split(",") : [];

  const { count, rows: comicsResult } = await Comic.findAndCountAll({
    where: {
      number_of_chapters: {
        [Op.gt]: 0, // Chỉ chọn các comic có number_of_chapter > 0
      },
      ...(status !== "all" && { status }),
      ...(search && {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { subname: { [Op.like]: `%${search}%` } },
        ],
      }),
    },
    include: genreIds.length
      ? [
          {
            model: Genre,
            where: {
              id: { [Op.in]: genreIds },
            },
            through: { attributes: [] }, // không cần data từ bảng trung gian
            required: true, // inner join
          },
        ]
      : [],
    order: [[orderBy, order]],
    limit: Number(limit) > 0 ? Number(limit) : undefined, // chỉ áp dụng limit nếu limit > 0
    offset: Number(limit) > 0 ? (Number(page) - 1) * Number(limit) : undefined, // chỉ áp dụng offset nếu limit > 0
  });

  const comics = comicsResult.map((comic) => comic.dataValues);

  return !isEmpty(comics)
    ? { count, comics: convertToCamelCase(comics) }
    : { count: 0, comics: [] };
};

const getComicByComicId = async ({ comicId }) => {
  const comic = await Comic.findOne({
    where: { id: comicId },
  });

  return !isEmpty(comic)
    ? { comic: convertToCamelCase(comic.dataValues) }
    : { comic: {} };
};

const createComic = async ({ comicInfo }) => {
  const [comic, created] = await Comic.findOrCreate({
    where: {
      [Sequelize.Op.or]: [{ name_minio: comicInfo.nameMinio }],
    },
    defaults: {
      name: comicInfo.name,
      subname: comicInfo.subname,
      cover: comicInfo.cover,
      status: comicInfo.status,
      author: comicInfo.author,
      translator: comicInfo.translator,
      description: comicInfo.description,
      name_minio: comicInfo.nameMinio,
      poster_id: comicInfo.userId,
    },
  });

  return { comic: convertToCamelCase(comic.dataValues), created };
};

const updateComicByComicId = async ({ comicInfo }) => {
  const [count] = await Comic.update(
    {
      name: comicInfo.name,
      cover: comicInfo.cover,
      subname: comicInfo.subname,
      status: comicInfo.status,
      author: comicInfo.author,
      translator: comicInfo.translator,
      description: comicInfo.description,
      name_minio: comicInfo.nameMinio,
      poster_id: comicInfo.userId,
    },
    {
      where: { id: comicInfo.id },
    }
  );

  return { updated: count > 0 };
};

const deleteComicByComicId = async ({ comicId }) => {
  const count = await Comic.destroy({
    where: { id: comicId },
  });

  return { deleted: count > 0 };
};

const getComicsByUserId = async ({
  userId,
  page = 1,
  limit = 0,
  genres = "",
  order = "DESC",
  status = "all",
  orderBy = "created_at",
}) => {
  const genreIds = genres ? genres.split(",") : [];

  const { count, rows: comicsResult } = await Comic.findAndCountAll({
    where: {
      poster_id: userId,
      ...(status !== "all" && { status }),
    },
    include: genreIds.length
      ? [
          {
            model: Genre,
            where: {
              id: { [Op.in]: genreIds },
            },
            through: { attributes: [] }, // không cần data từ bảng trung gian
            required: true, // inner join
          },
        ]
      : [],
    order: [[orderBy, order]],
    limit: Number(limit) > 0 ? Number(limit) : undefined, // chỉ áp dụng limit nếu limit > 0
    offset: Number(limit) > 0 ? (Number(page) - 1) * Number(limit) : undefined, // chỉ áp dụng offset nếu limit > 0
  });

  const comics = comicsResult.map((comic) => comic.dataValues);

  return !isEmpty(comics)
    ? { count, comics: convertToCamelCase(comics) }
    : { count: 0, comics: [] };
};

const getBookmarkComicsByUserId = async ({
  userId,
  page,
  limit,
  orderBy,
  order,
}) => {
  const { count, rows: comicsResult } = await BookmarkComicUser.findAndCountAll(
    {
      where: { user_id: userId },
      include: [
        {
          model: Comic,
        },
      ],
      order: [[orderBy, order]],
      limit: limit > 0 ? limit : undefined, // chỉ áp dụng limit nếu limit > 0
      offset: limit > 0 ? (page - 1) * limit : undefined, // chỉ áp dụng offset nếu limit > 0
    }
  );

  const comics = comicsResult.map((comic) => {
    const comicData = comic.dataValues;
    const comicInfo = comicData.Comic.dataValues;
    return { ...comicData, comic: comicInfo };
  });

  return !isEmpty(comics)
    ? { count, comics: convertToCamelCase(comics) }
    : { count: 0, comics: [] };
};

module.exports = {
  getComics,
  getComicByComicId,
  createComic,
  updateComicByComicId,
  deleteComicByComicId,
  getComicsByUserId,
  getBookmarkComicsByUserId,
};
