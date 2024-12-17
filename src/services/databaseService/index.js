const user = require("./user.service");
const auth = require("./auth.service");
const comic = require("./comic.service");
const genre = require("./genre.service");
const image = require("./image.service");
const chapter = require("./chapter.service");
const comment = require("./comment.service");
const comicGenre = require("./comicGenre.service");
const minIOServices = require("./minIOServices");
const ratingComicUser = require("./ratingComicUser.service");
const bookmarkComicUser = require("./bookmarkComicUser.service");
const likeDislikeComment = require("./likeDislikeComment.service");

module.exports = {
  ...user,
  ...auth,
  ...comic,
  ...image,
  ...genre,
  ...chapter,
  ...comment,
  ...comicGenre,
  ...minIOServices,
  ...ratingComicUser,
  ...bookmarkComicUser,
  ...likeDislikeComment,
};
