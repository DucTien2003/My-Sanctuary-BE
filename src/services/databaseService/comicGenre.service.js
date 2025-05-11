const { Sequelize } = require("sequelize");
const { convertToCamelCase } = require("../../utils");
const { Genre, ComicGenre } = require("../../models");
const { isEmpty } = require("../../utils");

const getGenresForComicByComicId = async ({
  comicId,
  page,
  limit,
  orderBy,
  order,
}) => {
  const { count, rows: genresResult } = await Genre.findAndCountAll({
    include: [
      {
        model: ComicGenre,
        where: { comic_id: comicId },
        required: true,
      },
    ],
    order: [["name", "ASC"]],
    // order: [[orderBy, order]],
    limit: limit > 0 ? limit : undefined, // chỉ áp dụng limit nếu limit > 0
    offset: limit > 0 ? (page - 1) * limit : undefined, // chỉ áp dụng offset nếu limit > 0
  });

  const genres = genresResult.map((genre) => genre.dataValues);

  return !isEmpty(genres)
    ? { count, genres: convertToCamelCase(genres) }
    : { count: 0, genres: [] };
};

const createOrUpdateGenresForComicByComicId = async ({ comicId, genreIds }) => {
  // Delete all genres of comic
  const count = await ComicGenre.destroy({
    where: {
      comic_id: comicId,
      genre_id: {
        [Sequelize.Op.in]: genreIds,
      },
    },
  });

  // Create new genres for comic
  const insertValues = genreIds.map((genreId) => ({
    comic_id: comicId,
    genre_id: genreId,
  }));

  const genresResult = await ComicGenre.bulkCreate(insertValues);

  const genres = genresResult.map((record) => record.dataValues);

  return { genres: convertToCamelCase(genres) };
};

const deleteGenresForComicByComicId = async ({ comicId }) => {
  const count = await ComicGenre.destroy({
    where: { comic_id: comicId },
  });

  return { deleted: count >= 0 };
};

module.exports = {
  getGenresForComicByComicId,
  createOrUpdateGenresForComicByComicId,
  deleteGenresForComicByComicId,
};
