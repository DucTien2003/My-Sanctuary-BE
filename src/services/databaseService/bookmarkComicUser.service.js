const { isEmpty, convertToCamelCase } = require("../../utils");
const { BookmarkComicUser } = require("../../models");

const getBookmarkByUserForComic = async ({ comicId, userId }) => {
  const bookmarkResult = await BookmarkComicUser.findOne({
    where: { comic_id: comicId, user_id: userId },
  });

  const bookmark = bookmarkResult ? bookmarkResult.dataValues : {};

  return !isEmpty(bookmark)
    ? { bookmark: convertToCamelCase(bookmark) }
    : { bookmark: {} };
};

const createBookmarkByUserForComic = async ({ comicId, userId }) => {
  const [bookmark, created] = await BookmarkComicUser.findOrCreate({
    where: { comic_id: comicId, user_id: userId },
  });

  return { bookmark: convertToCamelCase(bookmark.dataValues), created };
};

const deleteBookmarkByUserForComic = async ({ comicId, userId }) => {
  const count = await BookmarkComicUser.destroy({
    where: { comic_id: comicId, user_id: userId },
  });

  return { delete: count > 0 };
};

module.exports = {
  getBookmarkByUserForComic,
  createBookmarkByUserForComic,
  deleteBookmarkByUserForComic,
};
