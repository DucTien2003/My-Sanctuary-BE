const databaseService = require("./databaseService");
const { isEmpty, errorSystemResponse } = require("../utils");

const getImagesByChapterIdService = async ({ chapterId }) => {
  const { count, images } = await databaseService.getImagesByChapterId({
    chapterId,
  });

  return {
    code: 200,
    success: true,
    message: "Lấy ảnh chương thành công",
    count,
    images,
  };
};

const createImagesService = async ({ imagesData }) => {
  if (imagesData.length === 0) {
    return {
      code: 400,
      success: false,
      message: "Không có ảnh để tạo",
    };
  }

  const { images, created } = await databaseService.createImages(imagesData);

  return {
    code: 200,
    success: true,
    message: "Tạo ảnh thành công",
    images,
  };
};

const deleteImagesByChapterIdService = async ({ chapterId }) => {
  const { deleted } = await databaseService.deleteImagesByChapterId({
    chapterId,
  });

  if (!deleted) {
    return {
      code: 404,
      success: false,
      message: "Chương không tồn tại",
    };
  }

  return {
    code: 200,
    success: true,
    message: "Xóa ảnh thành công",
  };
};

const getChapterByChapterIdService = async ({ chapterId }) => {
  const { chapter } = await databaseService.getChapterByChapterId({
    chapterId,
  });

  if (isEmpty(chapter)) {
    return {
      code: 404,
      success: false,
      message: "Chương không tồn tại",
    };
  }

  return {
    code: 200,
    success: true,
    message: "Lấy chương thành công",
    chapter,
  };
};

const createChapterService = async ({ imageFiles, comicInfo, chapterData }) => {
  // Check if chapter index exists
  const { existed: chapterIndexExists } =
    await databaseService.checkChapterIndexExistsByComicId({
      comicId: comicInfo.id,
      numberOrder: chapterData.numberOrder,
    });

  if (chapterIndexExists) {
    return {
      code: 409,
      success: false,
      message: "Number order đã tồn tại",
      errors: [
        {
          field: "numberOrder",
          message: "STT đã tồn tại",
        },
      ],
    };
  }

  // Create chapter
  const chapterNameMinio = "chapter-" + chapterData.numberOrder;
  const [{ chapter, created }] = await Promise.all([
    databaseService.createChapter({
      chapterData: {
        comicId: comicInfo.id,
        name: chapterData.name,
        numberOrder: chapterData.numberOrder,
        nameMinio: chapterNameMinio,
      },
    }),
  ]);

  // Create images
  if (created && chapter) {
    const chapterId = chapter.id;
    const imagesData = [];

    // Upload images to Minio
    const uploadImagePromises = imageFiles.map(async (imageFile, index) => {
      const uploadImageResult = await databaseService.uploadImage(
        comicInfo.nameMinio,
        chapterNameMinio + `/page-${index + 1}`,
        imageFile
      );

      imagesData.push({
        numberOrder: index + 1,
        url: uploadImageResult.fileUrl,
        chapterId,
      });
    });

    await Promise.all(uploadImagePromises);

    const createImagesResult = await databaseService.createImages({
      imagesData,
    });

    if (createImagesResult.created) {
      return {
        code: 200,
        success: true,
        message: "Tạo chương thành công",
        chapter,
        images: createImagesResult.images,
      };
    } else {
      return {
        code: 500,
        success: false,
        message: "Tạo ảnh chương thất bại",
      };
    }
  } else {
    return {
      code: 409,
      success: false,
      message: "Chương đã tồn tại",
    };
  }
};

const updateChapterByChapterIdService = async ({
  chapterId,
  comicInfo,
  imageFiles,
  chapterData,
}) => {
  // Check if number order exists
  if (chapterData.oldNumberOrder !== chapterData.numberOrder) {
    const { existed: chapterIndexExists } =
      await databaseService.checkChapterIndexExistsByComicId({
        comicId: comicInfo.id,
        numberOrder: chapterData.numberOrder,
      });

    if (chapterIndexExists) {
      return {
        code: 409,
        success: false,
        message: "Number order đã tồn tại",
        errors: [
          {
            field: "numberOrder",
            message: "Number order đã tồn tại",
          },
        ],
      };
    }
  }

  // Delete old images
  const oldChapterNameMinio = "chapter-" + chapterData.oldNumberOrder;

  const [removeChapterMinioResult, deleteImagesResult] = await Promise.all([
    databaseService.removeChapter(comicInfo.nameMinio, oldChapterNameMinio),
    databaseService.deleteImagesByChapterId({
      chapterId,
    }),
  ]);

  if (!removeChapterMinioResult.success || !deleteImagesResult.deleted) {
    return {
      code: 500,
      success: false,
      message: "Cập nhật chương thất bại",
    };
  }

  // Update chapter
  const chapterNameMinio = "chapter-" + chapterData.numberOrder;
  const { updated } = await databaseService.updateChapterByChapterId({
    chapterData: {
      ...chapterData,
      id: chapterId,
      nameMinio: chapterNameMinio,
    },
  });

  if (!updated) {
    return {
      code: 404,
      success: false,
      message: "Chương không tồn tại",
    };
  }

  // Upload new images to Minio
  const imagesData = [];
  const uploadImagePromises = imageFiles.map(async (imageFile, index) => {
    const uploadImageResult = await databaseService.uploadImage(
      comicInfo.nameMinio,
      chapterNameMinio + `/page-${index + 1}`,
      imageFile
    );
    imagesData.push({
      numberOrder: index + 1,
      url: uploadImageResult.fileUrl,
      chapterId,
    });
  });

  await Promise.all(uploadImagePromises);
  const createImagesResult = await databaseService.createImages({
    imagesData,
  });

  if (createImagesResult.created) {
    return {
      code: 200,
      success: true,
      message: "Update chương thành công",
      images: createImagesResult.images,
    };
  } else {
    return {
      code: 500,
      success: false,
      message: "Tạo ảnh chương thất bại",
    };
  }
};

const deleteChapterByChapterIdService = async ({
  chapterId,
  comicNameMinio,
  chapterNameMinio,
}) => {
  // Delete chapter images and remove chapter folder in Minio
  const [removeChapterMinioResult, deleteImagesResult] = await Promise.all([
    databaseService.removeChapter(comicNameMinio, chapterNameMinio),
    databaseService.deleteImagesByChapterId({ chapterId }),
  ]);

  if (!removeChapterMinioResult.success || !deleteImagesResult.deleted) {
    return errorSystemResponse;
  }

  // Delete chapter
  const { deleted } = await databaseService.deleteChapterByChapterId({
    chapterId,
  });

  if (!deleted) {
    return {
      code: 404,
      success: false,
      message: "Chương không tồn tại",
    };
  }

  return {
    code: 200,
    success: true,
    message: "Xóa chương thành công",
  };

  //   return res.json({ success: false });
};

const getChaptersByChapterIdsService = async ({
  chapterIds,
  page = 1,
  limit = 0,
  orderBy = "created_at",
  sortType = "ASC",
}) => {
  const { count, chapters } = await databaseService.getChaptersByChapterIds({
    chapterIds,
    page: Number(page),
    limit: Number(limit),
    orderBy,
    sortType,
  });

  return {
    code: 200,
    success: true,
    message: "Lấy chương thành công",
    chapters,
    count,
  };
};

const updateChapterViewsByChapterIdService = async ({ chapterId }) => {
  const { updated } = await databaseService.updateChapterViewsByChapterId({
    chapterId,
  });

  if (!updated) {
    return {
      code: 404,
      success: false,
      message: "Chương không tồn tại",
    };
  }

  return {
    code: 200,
    success: true,
    message: "Cập nhật lượt xem chương thành công",
  };
};

const checkChapterExistsByComicIdService = async ({ comicId }) => {
  const { existed } = await databaseService.checkChapterExistsByComicId({
    comicId,
  });

  return {
    code: 200,
    success: true,
    message: "Kiểm tra chương thành công",
    existed,
  };
};

const checkChapterIndexExistsByComicIdService = async ({ comicId, index }) => {
  const { existed } = await databaseService.checkChapterIndexExistsByComicId({
    comicId,
    index,
  });

  return {
    code: 200,
    success: true,
    message: "Kiểm tra chương thành công",
    existed,
  };
};

const getLatestChapterByComicIdService = async ({ comicId }) => {
  const { chapter } = await databaseService.getLatestChapterByComicId({
    comicId,
  });

  return {
    code: 200,
    success: true,
    message: "Lấy chương mới nhất thành công",
    chapter,
  };
};

const getChaptersByComicIdService = async ({
  comicId,
  page = 1,
  limit = 0,
  sortType = "ASC",
  orderBy = "number_order",
}) => {
  const { count, chapters } = await databaseService.getChaptersByComicId({
    comicId,
    page: Number(page),
    limit: Number(limit),
    orderBy,
    sortType,
  });

  return {
    code: 200,
    success: true,
    message: "Lấy danh sách chương thành công",
    chapters,
    count,
  };
};

module.exports = {
  getImagesByChapterIdService,
  createImagesService,
  deleteImagesByChapterIdService,
  getChapterByChapterIdService,
  createChapterService,
  updateChapterByChapterIdService,
  deleteChapterByChapterIdService,
  getChaptersByChapterIdsService,
  updateChapterViewsByChapterIdService,
  checkChapterExistsByComicIdService,
  checkChapterIndexExistsByComicIdService,
  getLatestChapterByComicIdService,
  getChaptersByComicIdService,
};
