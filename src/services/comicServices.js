const databaseService = require("./databaseService");
const { isEmpty, formatPath, errorSystemResponse } = require("../utils");

const getComicsService = async (query) => {
  const { count, comics } = await databaseService.getComics(query);

  const comicsWithLatestChapter = await Promise.all(
    comics.map(async (comic) => {
      const { chapter: latestChapter } =
        await databaseService.getLatestChapterByComicId({ comicId: comic.id });

      return {
        ...comic,
        latestChapter,
      };
    })
  );

  return {
    code: 200,
    success: true,
    message: "Lấy danh sách truyện thành công",
    comics: comicsWithLatestChapter,
    count,
  };
};

const getComicByComicIdService = async ({ comicId, userId }) => {
  const results = await Promise.all([
    databaseService.getComicByComicId({ comicId }),
    databaseService.getGenresForComicByComicId({
      comicId,
      page: 1,
      limit: 0,
      orderBy: "name",
      order: "DESC",
    }),
    ...(userId
      ? [
          databaseService.getRatingByUserForComic({ comicId, userId }),
          databaseService.getBookmarkByUserForComic({ comicId, userId }),
        ]
      : []),
  ]);

  const comicResult = results[0];
  const genresResult = results[1];
  const ratingResult = userId ? results[2] : null;
  const bookmarkResult = userId ? results[3] : null;

  if (isEmpty(comicResult.comic)) {
    return {
      code: 404,
      success: false,
      message: "Truyện không tồn tại",
    };
  }

  const comicInfo = {
    ...comicResult.comic,
    genres: genresResult.genres,
    ...(userId
      ? {
          authRating: !isEmpty(ratingResult.rating),
          authBookmark: !isEmpty(bookmarkResult.bookmark),
        }
      : {}),
  };

  return {
    code: 200,
    success: true,
    message: "Lấy thông tin truyện thành công",
    comic: comicInfo,
  };
};

const createComicService = async ({ userId, coverFile, comicInfo }) => {
  const coverBucket = "covers";
  let nameMinio = formatPath(comicInfo.name);

  // Handle create bucket and cover in Minio
  const nameOrigin = nameMinio;
  let isCoverExists = await databaseService.imageExists(
    coverBucket,
    `${nameMinio}.jpg`
  );

  while (isCoverExists.success && isCoverExists.existed) {
    const random = Math.floor(1000 + Math.random() * 9000);
    nameMinio = `${nameOrigin}-${random}`;
    isCoverExists = await databaseService.imageExists(
      coverBucket,
      `${nameMinio}.jpg`
    );
  }

  const [createBucketResult, uploadImageResult] = await Promise.all([
    databaseService.createBucket(nameMinio),
    databaseService.uploadImage(coverBucket, `${nameMinio}.jpg`, coverFile),
  ]);

  // Handle create comic
  if (createBucketResult.success && uploadImageResult.success) {
    const comic = {
      cover: uploadImageResult.fileUrl,
      userId,
      nameMinio,
      ...comicInfo,
    };

    const resultCreateComic = await databaseService.createComic({
      comicInfo: comic,
    });

    if (!resultCreateComic.created) {
      return {
        code: 409,
        success: false,
        message: "Tên truyện đã tồn tại",
      };
    }

    // Handle create genres for comic
    const resultCreateComicGenres =
      await databaseService.createOrUpdateGenresForComicByComicId({
        comicId: resultCreateComic.comic.id,
        genreIds: comicInfo.genres,
      });

    return {
      code: 200,
      success: true,
      message: "Tạo truyện thành công",
      comic: resultCreateComic.comic,
      genres: resultCreateComicGenres.genres,
    };
  }
};

const updateComicByComicIdService = async ({
  userId,
  comicId,
  coverFile,
  comicInfo,
  oldComicInfo,
}) => {
  let coverUrl = "";
  let nameMinio = formatPath(comicInfo.name);
  const coverBucket = "covers";

  // Handle remove old cover
  const oldCoverName = oldComicInfo.cover.split("/").pop();
  const removeImageResult = await databaseService.removeImage(
    coverBucket,
    oldCoverName
  );

  if (!removeImageResult.success) {
    return errorSystemResponse;
  }

  // Handle when change name of Comic
  if (oldComicInfo.nameMinio !== nameMinio) {
    const nameOrigin = nameMinio;
    let isCoverExists = await databaseService.imageExists(
      coverBucket,
      `${nameMinio}.jpg`
    );

    while (isCoverExists.success && isCoverExists.existed) {
      const random = Math.floor(1000 + Math.random() * 9000);
      nameMinio = `${nameOrigin}-${random}`;
      isCoverExists = await databaseService.imageExists(
        coverBucket,
        `${nameMinio}.jpg`
      );
    }

    // Rename bucket and upload cover
    const [renameResult, uploadResult] = await Promise.all([
      databaseService.renameBucket(oldComicInfo.nameMinio, nameMinio),
      databaseService.uploadImage(coverBucket, `${nameMinio}.jpg`, coverFile),
    ]);
    coverUrl = uploadResult.fileUrl;

    if (!renameResult.success || !uploadResult.success) {
      return errorSystemResponse;
    }
  } else {
    const [uploadResult] = await Promise.all([
      databaseService.uploadImage(coverBucket, oldCoverName, coverFile),
    ]);

    if (!uploadResult.success) {
      return errorSystemResponse;
    }

    coverUrl = uploadResult.fileUrl;
  }

  // Handle update comic
  const comic = {
    id: comicId,
    cover: coverUrl,
    userId,
    nameMinio,
    ...comicInfo,
  };

  const resultUpdateComic = await databaseService.updateComicByComicId({
    comicInfo: comic,
  });

  if (!resultUpdateComic.updated) {
    return {
      code: 404,
      success: false,
      message: "Truyện không tồn tại",
    };
  }

  // Handle update genres for comic
  const resultUpdateComicGenres =
    await databaseService.createOrUpdateGenresForComicByComicId({
      comicId,
      genreIds: comicInfo.genres,
    });

  return {
    code: 200,
    success: true,
    message: "Cập nhật truyện thành công",
    comic,
    genres: resultUpdateComicGenres.genres,
  };
};

const deleteComicByComicIdService = async ({ comicId }) => {
  // const { deleted } = await databaseService.deleteComicByComicId({ comicId });

  // Check if comic still has chapter
  const { existed: isStillChapterExists } =
    await databaseService.checkChapterExistsByComicId({ comicId });

  if (isStillChapterExists) {
    return {
      code: 400,
      success: false,
      message: "Truyện vẫn còn chương, không thể xóa",
    };
  }

  // Delete genres of comic
  const [{ deleted: deleteGenresComicsResult }] = await Promise.all([
    databaseService.deleteGenresForComicByComicId({ comicId }),
  ]);

  if (deleteGenresComicsResult) {
    // Get comic info
    const [{ comic }] = await Promise.all([
      databaseService.getComicByComicId({ comicId }),
    ]);

    const coverBucket = "covers";
    const coverName = comic.cover.split("/").pop();

    // Delete comic, remove image and bucket in Minio
    const [deleteComicResult, removeImageResult, deleteBucketResult] =
      await Promise.all([
        databaseService.deleteComicByComicId({ comicId }),
        databaseService.removeImage(coverBucket, coverName),
        databaseService.removeBucket(comic.nameMinio),
      ]);

    if (
      deleteComicResult.deleted &&
      removeImageResult.success &&
      deleteBucketResult.success
    ) {
      return {
        code: 200,
        success: true,
        message: "Xóa truyện thành công",
      };
    }
  }
};

const getRatingByUserForComicService = async ({ comicId, userId }) => {
  const { rating } = await databaseService.getRatingByUserForComic({
    comicId,
    userId,
  });

  if (isEmpty(rating)) {
    return {
      code: 404,
      success: false,
      message: "Rating không tồn tại",
    };
  }

  return {
    code: 200,
    success: true,
    message: "Lấy rating thành công",
    rating,
  };
};

const createOrUpdateRatingByUserForComicService = async ({
  userId,
  comicId,
  ratingData,
}) => {
  const { rating, created } =
    await databaseService.createOrUpdateRatingByUserForComic({
      comicId,
      userId,
      ratingData,
    });

  return {
    code: 200,
    success: true,
    message: "Cập nhật đánh giá thành công",
    rating,
  };
};

const deleteRatingByUserForComicService = async ({ comicId, userId }) => {
  const { deleted } = await databaseService.deleteRatingByUserForComic({
    comicId,
    userId,
  });

  if (!deleted) {
    return {
      code: 404,
      success: false,
      message: "Đánh giá không tồn tại",
    };
  }

  return {
    code: 200,
    success: true,
    message: "Xóa rating thành công",
  };
};

const createBookmarkByUserForComicService = async ({ comicId, userId }) => {
  const { bookmark, created } =
    await databaseService.createBookmarkByUserForComic({ comicId, userId });

  return {
    code: 200,
    success: true,
    message: "Bookmark thành công",
    bookmark,
  };
};

const deleteBookmarkByUserForComicService = async ({ comicId, userId }) => {
  const { deleted } = await databaseService.deleteBookmarkByUserForComic({
    comicId,
    userId,
  });

  if (!deleted) {
    return {
      code: 404,
      success: false,
      message: "Bookmark không tồn tại",
    };
  }

  return {
    code: 200,
    success: true,
    message: "Xóa bookmark thành công",
  };
};

const getGenresForComicByComicIdService = async ({ comicId }) => {
  const { count, genres } = await databaseService.getGenresForComicByComicId({
    comicId,
  });

  return {
    code: 200,
    success: true,
    message: "Lấy genres thành công",
    genres,
  };
};

const createOrUpdateGenresForComicByComicIdService = async ({
  comicId,
  genreIds,
}) => {
  const { genres } =
    await databaseService.createOrUpdateGenresForComicByComicId({
      comicId,
      genreIds,
    });

  return {
    code: 200,
    success: true,
    message: "Cập nhật genres thành công",
    genres,
  };
};

const deleteGenresForComicByComicIdService = async ({ comicId }) => {
  const { deleted } = await databaseService.deleteGenresForComicByComicId({
    comicId,
  });

  if (!deleted) {
    return {
      code: 404,
      success: false,
      message: "Genres không tồn tại",
    };
  }

  return {
    code: 200,
    success: true,
    message: "Xóa genres thành công",
  };
};

const getComicsByUserIdService = async (query) => {
  const { count, comics } = await databaseService.getComicsByUserId(query);

  return {
    code: 200,
    success: true,
    message: "Lấy thông tin truyện của user thành công",
    comics,
    count,
  };
};

const getBookmarkComicsByUserIdService = async ({
  userId,
  page = 1,
  limit = 0,
  orderBy = "created_at",
  order = "ASC",
}) => {
  const { count, comics } = await databaseService.getBookmarkComicsByUserId({
    userId,
    page: Number(page),
    limit: Number(limit),
    orderBy,
    order,
  });

  const comicsWithLatestChapter = await Promise.all(
    comics.map(async (comic) => {
      const { chapter: latestChapter } =
        await databaseService.getLatestChapterByComicId({
          comicId: comic.comic.id,
        });

      return {
        ...comic,
        comic: {
          ...comic.comic,
          latestChapter,
        },
      };
    })
  );

  return {
    code: 200,
    success: true,
    message: "Lấy danh sách truyện đã bookmark thành công",
    comics: comicsWithLatestChapter,
    count,
  };
};

module.exports = {
  getComicsService,
  getComicByComicIdService,
  createComicService,
  updateComicByComicIdService,
  deleteComicByComicIdService,
  getRatingByUserForComicService,
  createOrUpdateRatingByUserForComicService,
  deleteRatingByUserForComicService,
  createBookmarkByUserForComicService,
  deleteBookmarkByUserForComicService,
  getGenresForComicByComicIdService,
  createOrUpdateGenresForComicByComicIdService,
  deleteGenresForComicByComicIdService,
  getComicsByUserIdService,
  getBookmarkComicsByUserIdService,
};
