const { RatingComicUser } = require("../../models");
const { isEmpty, convertToCamelCase } = require("../../utils");

const getRatingByUserForComic = async ({ comicId, userId }) => {
  const ratingResult = await RatingComicUser.findOne({
    where: { comic_id: comicId, user_id: userId },
  });

  const rating = ratingResult ? ratingResult.dataValues : {};

  return !isEmpty(rating)
    ? { rating: convertToCamelCase(rating) }
    : { rating: {} };
};

const createOrUpdateRatingByUserForComic = async ({
  comicId,
  userId,
  ratingData,
}) => {
  const [rating, created] = await RatingComicUser.upsert({
    comic_id: comicId,
    user_id: userId,
    rating: ratingData,
  });

  return { rating: convertToCamelCase(rating.dataValues), created };
};

const deleteRatingByUserForComic = async ({ comicId, userId }) => {
  const count = await RatingComicUser.destroy({
    where: { comic_id: comicId, user_id: userId },
  });

  return { deleted: count > 0 };
};

module.exports = {
  getRatingByUserForComic,
  createOrUpdateRatingByUserForComic,
  deleteRatingByUserForComic,
};
