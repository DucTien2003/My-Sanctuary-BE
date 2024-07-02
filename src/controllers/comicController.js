const { isEmpty } = require('../utils');

const {
  getComicById,
  createComicRating,
  updateComicRating,
  deleteComicRating,
  getGenresByComicId,
  createComicBookmark,
  deleteComicBookmark,
  getComicRatingByUserId,
  getComicBookmarkByUserId,
} = require('../services/comicServices.js');

const handleGetComicById = async (req, res) => {
  const authId = req.id;
  const comicId = req.params.comicId;

  Promise.all([
    getComicById(comicId),
    getGenresByComicId(comicId),
    getComicRatingByUserId(comicId, authId),
    getComicBookmarkByUserId(comicId, authId),
  ])
    .then((values) => {
      const [comicInfo, genres, authRating, authBookmark] = values;

      return res.json({
        ...comicInfo,
        genres: genres.map((genre) => genre.title),
        authRating: isEmpty(authRating) ? 0 : authRating.rating,
        authBookmark: !isEmpty(authBookmark),
      });
    })
    .catch((error) => {
      console.log('Error handleGetComicById: ', error);
      return res.status(500).json({});
    });
};

const handleCreateComicRating = async (req, res) => {
  const userId = req.id;
  const rating = req.body.rating;
  const comicId = req.params.comicId;

  createComicRating(comicId, userId, rating)
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => {
      console.log('Error: ', error);
      return res.status(500).json({});
    });
};

const handleUpdateComicRating = async (req, res) => {
  const userId = req.id;
  const rating = req.body.rating;
  const comicId = req.params.comicId;

  updateComicRating(comicId, userId, rating)
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => {
      console.log('Error: ', error);
      return res.status(500).json({});
    });
};

const handleDeleteComicRating = async (req, res) => {
  const userId = req.id;
  const comicId = req.params.comicId;

  deleteComicRating(comicId, userId)
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => {
      console.log('Error: ', error);
      return res.status(500).json({});
    });
};

const handleCreateComicBookmark = async (req, res) => {
  const userId = req.id;
  const comicId = req.params.comicId;

  createComicBookmark(comicId, userId)
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => {
      console.log('Error: ', error);
      return res.status(500).json({});
    });
};

const handleDeleteComicBookmark = async (req, res) => {
  const userId = req.id;
  const comicId = req.params.comicId;

  deleteComicBookmark(comicId, userId)
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => {
      console.log('Error: ', error);
      return res.status(500).json({});
    });
};

module.exports = {
  handleGetComicById,
  handleCreateComicRating,
  handleUpdateComicRating,
  handleDeleteComicRating,
  handleCreateComicBookmark,
  handleDeleteComicBookmark,
};
