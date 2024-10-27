const { uploadImage, removeChapter } = require("../services/minIOServices");

const {
  createImages,
  createChapter,
  getChapterById,
  updateChapterViews,
  getImagesByChapterId,
  checkChapterIndexExists,
  deleteImagesByChapterId,
  getAllChaptersByComicId,
  updateChapterByChapterId,
  deleteChapterByChapterId,
} = require("../services/chapterServices");

const handleGetImagesOfChapter = async (req, res) => {
  const chapterId = req.params.chapterId;

  getImagesByChapterId(chapterId)
    .then((images) => {
      return res.json(images);
    })
    .catch((error) => {
      console.log("Error handleGetImagesOfChapter: ", error);
      return res.status(500).json([]);
    });
};

const handleGetChapterById = async (req, res) => {
  const chapterId = req.params.chapterId;

  getChapterById(chapterId)
    .then((chapters) => {
      return res.json(chapters);
    })
    .catch((error) => {
      console.log("Error handleGetChapterById: ", error);
      return res.status(500).json({});
    });
};

const handleGetAllChaptersByComicId = async (req, res) => {
  const comicId = req.params.comicId;

  getAllChaptersByComicId(comicId)
    .then((chapters) => {
      return res.json(chapters);
    })
    .catch((error) => {
      console.log("Error handleGetAllChaptersByComicId: ", error);
      return res.status(500).json([]);
    });
};

const handleUpdateChapterViews = async (req, res) => {
  const chapterId = req.params.chapterId;

  updateChapterViews(chapterId)
    .then((result) => {
      return res.json(result);
    })
    .catch((error) => {
      console.log("Error handleUpdateChapterViews: ", error);
      return res.status(500).json(false);
    });
};

const handleCreateChapter = async (req, res) => {
  const imageFiles = req.files;
  const { index, name } = req.body;
  const comicInfo = JSON.parse(req.body.comicInfo);
  const chapterNameMinio = "chapter-" + index;

  const chapterIndexExists = await checkChapterIndexExists(comicInfo.id, index);

  if (chapterIndexExists) {
    return res.json({
      success: false,
      error: "Chapter index exists",
      isExists: true,
    });
  }

  try {
    const [createChapterResult] = await Promise.all([
      createChapter({
        index,
        name,
        nameMinio: chapterNameMinio,
        comicId: comicInfo.id,
      }),
    ]);

    if (createChapterResult.success) {
      const chapterId = createChapterResult.insertId;
      const imagesInfo = [];

      const uploadImagePromises = imageFiles.map(async (imageFile, index) => {
        const uploadImageResult = await uploadImage(
          comicInfo.nameMinio,
          chapterNameMinio + `/page-${index + 1}`,
          imageFile
        );

        imagesInfo.push({
          index: index + 1,
          url: uploadImageResult.fileUrl,
          chapterId,
        });
      });

      await Promise.all(uploadImagePromises);

      const createImagesResult = await createImages(imagesInfo);

      if (createImagesResult.success) {
        return res.json({ success: true });
      } else {
        return res.json({ success: false });
      }
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.log("Error handleCreateChapter: ", error);
    return res.json({ success: false });
  }
};

const handleUpdateChapter = async (req, res) => {
  const chapterId = req.params.chapterId;
  const imageFiles = req.files;
  const { index, name, oldIndex } = req.body;
  const comicInfo = JSON.parse(req.body.comicInfo);

  if (oldIndex !== index) {
    const chapterIndexExists = await checkChapterIndexExists(
      comicInfo.id,
      index
    );

    if (chapterIndexExists) {
      return res.json({
        success: false,
        error: "Chapter index exists",
        isExists: true,
      });
    }
  }

  try {
    const oldChapterNameMinio = "chapter-" + oldIndex;
    const [removeChapterMinioResult, deleteImagesResult] = await Promise.all([
      removeChapter(comicInfo.nameMinio, oldChapterNameMinio),
      deleteImagesByChapterId(chapterId),
    ]);

    if (!removeChapterMinioResult.success || !deleteImagesResult.success) {
      return res.json({ success: false });
    }

    const chapterNameMinio = "chapter-" + index;
    const imagesInfo = [];

    const uploadImagePromises = imageFiles.map(async (imageFile, index) => {
      const uploadImageResult = await uploadImage(
        comicInfo.nameMinio,
        chapterNameMinio + `/page-${index + 1}`,
        imageFile
      );

      imagesInfo.push({
        index: index + 1,
        url: uploadImageResult.fileUrl,
        chapterId,
      });
    });

    await Promise.all(uploadImagePromises);

    const createImagesResult = await createImages(imagesInfo);

    if (createImagesResult.success) {
      const updateChapterResult = await updateChapterByChapterId({
        id: chapterId,
        nameMinio: chapterNameMinio,
        index,
        name,
      });

      if (updateChapterResult.success) {
        return res.json({ success: true });
      } else {
        return res.json({ success: false });
      }
    } else {
      return res.json({ success: false });
    }
  } catch (error) {
    console.log("Error handleUpdateChapter: ", error);
    return res.json({ success: false });
  }
};

const handleDeleteChapterById = async (req, res) => {
  const chapterId = req.params.chapterId;
  const comicNameMinio = req.query.comicNameMinio;

  try {
    const [chapterInfo] = await Promise.all([getChapterById(chapterId)]);
    const chapterNameMinio = chapterInfo.nameMinio;

    const [removeChapterMinioResult, deleteImagesResult] = await Promise.all([
      removeChapter(comicNameMinio, chapterNameMinio),
      deleteImagesByChapterId(chapterId),
    ]);

    if (removeChapterMinioResult.success && deleteImagesResult.success) {
      const deleteChapterResult = await deleteChapterByChapterId(chapterId);

      if (deleteChapterResult.success) {
        return res.json({ success: true });
      }
    }

    return res.json({ success: false });
  } catch (error) {
    console.log("Error handleDeleteChapterById: ", error);
    return res.json({ success: false });
  }
};

module.exports = {
  handleCreateChapter,
  handleUpdateChapter,
  handleGetChapterById,
  handleDeleteChapterById,
  handleUpdateChapterViews,
  handleGetImagesOfChapter,
  handleGetAllChaptersByComicId,
};
