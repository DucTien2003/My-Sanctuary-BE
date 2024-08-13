const { isEmpty, formatPath } = require('../utils');
const {
  getLatestChapter,
  checkChapterExistsByComicId,
} = require('../services/chapterServices');
const {
  imageExists,
  uploadImage,
  removeImage,
  createBucket,
  renameBucket,
  removeBucket,
} = require('../services/minIOServices');
const {
  createComic,
  updateComic,
  getAllGenres,
  getComicById,
  getListComics,
  getComicsByUserId,
  createComicRating,
  updateComicRating,
  deleteComicRating,
  getGenresByComicId,
  createGenresComics,
  updateGenresComics,
  deleteGenresComics,
  createComicBookmark,
  deleteComicBookmark,
  deleteComicByComicId,
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
        genres,
        authRating: isEmpty(authRating) ? 0 : authRating.rating,
        authBookmark: !isEmpty(authBookmark),
      });
    })
    .catch((error) => {
      console.log('Error handleGetComicById: ', error);
      return res.status(500).json({});
    });
};

const handleGetComicsByAuthId = async (req, res) => {
  const userId = req.id;

  getComicsByUserId(userId)
    .then((comics) => {
      return res.json(comics);
    })
    .catch((error) => {
      console.log('Error handleGetComicByUserId: ', error);
      return res.status(500).json([]);
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
      console.log('Error handleCreateComicRating: ', error);
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
      console.log('Error handleUpdateComicRating: ', error);
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
      console.log('Error handleDeleteComicRating: ', error);
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
      console.log('Error handleCreateComicBookmark: ', error);
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

const handleGetAllGenres = async (req, res) => {
  getAllGenres()
    .then((genres) => {
      return res.json(genres);
    })
    .catch((error) => {
      console.log('Error handleGetAllGenres: ', error);
      return res.status(500).json([]);
    });
};

const handleCreateComic = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const userId = req.id;
  const imageFiles = req.files;
  const genres = JSON.parse(req.body.genres);
  const { name, author, status, subName, translator, description } = req.body;

  let nameMinio = formatPath(name);
  const coverBucket = 'covers';

  try {
    const nameOrigin = nameMinio;
    let isCoverExists = await imageExists(coverBucket, `${nameMinio}.jpg`);

    while (isCoverExists) {
      const random = Math.floor(1000 + Math.random() * 9000);
      nameMinio = `${nameOrigin}-${random}`;
      isCoverExists = await imageExists(coverBucket, `${nameMinio}.jpg`);
    }

    const [createBucketResult, uploadImageResult] = await Promise.all([
      createBucket(nameMinio),
      uploadImage(coverBucket, `${nameMinio}.jpg`, imageFiles[0]),
    ]);

    if (createBucketResult.success && uploadImageResult.success) {
      const comic = {
        name,
        cover: uploadImageResult.fileUrl,
        userId,
        author,
        status,
        subName,
        nameMinio,
        translator,
        description,
      };

      const resultCreateComic = await createComic(comic);
      if (!resultCreateComic.success) {
        return res.status(500).json({ message: 'Create comic failed' });
      }

      const result = await createGenresComics(
        resultCreateComic.newComicId,
        genres
      );

      if (result.success) {
        res.json({ success: true });
      }
    }
  } catch (error) {
    console.log('Error handleCreateComic: ', error);
    return res.status(500).json({});
  }
};

const handleUpdateComicById = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const comicId = req.params.comicId;
  const imageFiles = req.files;
  const genres = JSON.parse(req.body.genres);
  const oldComicInfo = JSON.parse(req.body.oldComicInfo);
  const { name, author, status, subName, translator, description } = req.body;

  let coverUrl = '';
  let nameMinio = formatPath(name);
  const coverBucket = 'covers';

  try {
    const oldCoverName = oldComicInfo.cover.split('/').pop();
    const removeImageResult = await removeImage(coverBucket, oldCoverName);

    if (!removeImageResult.success) {
      // return res.status(500).json({});
    }

    if (oldComicInfo.nameMinio !== nameMinio) {
      const nameOrigin = nameMinio;
      let isCoverExists = await imageExists(coverBucket, `${nameMinio}.jpg`);

      while (isCoverExists) {
        const random = Math.floor(1000 + Math.random() * 9000);
        nameMinio = `${nameOrigin}-${random}`;
        isCoverExists = await imageExists(coverBucket, `${nameMinio}.jpg`);
      }

      const [renameResult, uploadResult] = await Promise.all([
        renameBucket(oldComicInfo.nameMinio, nameMinio),
        uploadImage(coverBucket, `${nameMinio}.jpg`, imageFiles[0]),
      ]);
      coverUrl = uploadResult.fileUrl;

      if (!renameResult.success || !uploadResult.success) {
        return res.status(500).json({});
      }
    } else {
      const [uploadResult] = await Promise.all([
        uploadImage(coverBucket, oldCoverName, imageFiles[0]),
      ]);
      coverUrl = uploadResult.fileUrl;
    }

    const comic = {
      id: comicId,
      name,
      cover: coverUrl,
      author,
      status,
      subName,
      nameMinio,
      translator,
      description,
    };

    const result = await updateComic(comic);

    if (result.success) {
      const resultGenres = await updateGenresComics(comicId, genres);

      if (resultGenres.success) {
        res.json({ success: true });
      }
    }
  } catch (error) {
    console.log('Error handleUpdateComic: ', error);
    return res.status(500).json({});
  }
};

const handleDeleteComicById = async (req, res) => {
  const comicId = req.params.comicId;

  const isStillChapterExists = await checkChapterExistsByComicId(comicId);

  if (isStillChapterExists) {
    return res.status(400).json({ message: 'Still have chapter exists' });
  }

  try {
    const [comicInfo] = await Promise.all([getComicById(comicId)]);

    const coverBucket = 'covers';
    const coverName = comicInfo.cover.split('/').pop();

    const [deleteGenresComicsResult] = await Promise.all([
      deleteGenresComics(comicId),
    ]);

    if (deleteGenresComicsResult.success) {
      const [deleteComicResult, removeImageResult, deleteBucketResult] =
        await Promise.all([
          deleteComicByComicId(comicId),
          removeImage(coverBucket, coverName),
          removeBucket(comicInfo.nameMinio),
        ]);

      if (
        deleteComicResult.success &&
        removeImageResult.success &&
        deleteBucketResult.success
      ) {
        return res.json({ success: true });
      }
    }
  } catch (error) {
    console.log('Error handleDeleteComicById: ', error);
    return res.status(500).json({});
  }
};

const handleGetListComics = async (req, res) => {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const orderBy = req.query.orderBy;
  const ascending = req.query.ascending;

  getListComics({ limit, orderBy, ascending, page })
    .then(async (comics) => {
      const comicsWithLatestChapter = await Promise.all(
        comics.map(async (comic) => {
          const latestChapter = await getLatestChapter(comic.id);
          return {
            ...comic,
            latestChapter,
          };
        })
      );

      return res.json(comicsWithLatestChapter);
    })
    .catch((error) => {
      console.log('Error handleGetListComics: ', error);
      return res.status(500).json([]);
    });
};

module.exports = {
  handleCreateComic,
  handleGetAllGenres,
  handleGetComicById,
  handleGetListComics,
  handleUpdateComicById,
  handleDeleteComicById,
  handleGetComicsByAuthId,
  handleCreateComicRating,
  handleUpdateComicRating,
  handleDeleteComicRating,
  handleCreateComicBookmark,
  handleDeleteComicBookmark,
};
