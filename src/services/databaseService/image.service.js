const { Image } = require("../../models");
const { isEmpty, convertToCamelCase } = require("../../utils");

const createImages = async ({ imagesData }) => {
  const insertValues = imagesData.map((imageInfo) => ({
    number_order: imageInfo.numberOrder,
    url: imageInfo.url,
    chapter_id: imageInfo.chapterId,
  }));

  const imagesResult = await Image.bulkCreate(insertValues);

  const images = imagesResult.map((image) =>
    convertToCamelCase(image.dataValues)
  );

  return !isEmpty(images)
    ? { images, created: true }
    : { images, created: false };
};

const getImagesByChapterId = async ({ chapterId }) => {
  const { count, rows: imagesResult } = await Image.findAndCountAll({
    where: { chapter_id: chapterId },
    order: [["number_order", "ASC"]],
  });

  const images = imagesResult.map((image) => image.dataValues);

  return !isEmpty(images)
    ? { count, images: convertToCamelCase(images) }
    : { count: 0, images: [] };
};

const deleteImagesByChapterId = async ({ chapterId }) => {
  const count = await Image.destroy({ where: { chapter_id: chapterId } });

  return { deleted: count >= 0 };
};

module.exports = {
  createImages,
  getImagesByChapterId,
  deleteImagesByChapterId,
};
