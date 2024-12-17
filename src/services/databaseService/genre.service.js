const { Genre } = require("../../models");
const { convertToCamelCase, isEmpty } = require("../../utils");

const getGenres = async () => {
  const { count, rows: genresResult } = await Genre.findAndCountAll({
    order: [["name", "ASC"]],
  });

  const genres = genresResult.map((genre) => genre.dataValues);

  return !isEmpty(genres)
    ? { count, genres: convertToCamelCase(genres) }
    : { count: 0, genres: [] };
};

module.exports = {
  getGenres,
};
