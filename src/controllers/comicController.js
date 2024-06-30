const { isEmpty } = require('../utils');

const {
  getComicById,
  createComicRating,
  updateComicRating,
  deleteComicRating,
  getComicRatingByUserId,
} = require('../services/comicServices.js');

const handleGetComicById = async (req, res) => {
  const authId = req.id;
  const comicId = req.params.comicId;

  Promise.all([getComicById(comicId), getComicRatingByUserId(comicId, authId)])
    .then((values) => {
      const [comicInfo, authRating] = values;

      return res.json({
        ...comicInfo,
        authRating: isEmpty(authRating) ? 0 : authRating.rating,
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

module.exports = {
  handleGetComicById,
  handleCreateComicRating,
  handleUpdateComicRating,
  handleDeleteComicRating,
};
