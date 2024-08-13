const path = require('path');

const { minioClient } = require('../../config/minIO');
const { getListChapters } = require('./bucketServices');

// Check exists of a chapter
const chapterExists = async (bucketName, chapterName) => {
  const exists = await getListChapters(bucketName, chapterName);

  if (exists.success && exists.list.length > 0) {
    return { isExists: true, exists };
  } else {
    return { isExists: false, exists };
  }
};

// Check exists of a image
const imageExists = async (bucketName, objectName) => {
  try {
    await minioClient.statObject(bucketName, objectName);
    return true;
  } catch (error) {
    if (error.code === 'NotFound') {
      return false;
    }
    throw error;
  }
};

// Upload chapter
const uploadImage = async (bucketName, objectName, imageFile) => {
  try {
    const port = process.env.MIO_PORT;
    const domain = process.env.MIO_DOMAIN;
    const metaData = {
      'Content-Type': imageFile.mimetype,
    };

    const result = await minioClient.putObject(
      bucketName,
      objectName,
      imageFile.buffer,
      metaData,
      (err, etag) => {
        if (err) {
          console.log('Error uploadImage: ', err);
          throw err;
        } else {
          const fileUrl = `${domain}:${port}/${bucketName}/${objectName}`;

          return { success: true, fileUrl };
        }
      }
    );

    return result;
  } catch (err) {
    console.log('Error uploadImage: ', err);
    return { success: false, error: err };
  }
};

// Remove image
const removeImage = async (bucketName, objectName) => {
  try {
    await minioClient.removeObject(bucketName, objectName);
    return { success: true };
  } catch (err) {
    console.log('Error removeImage: ', err);
    return { success: false, error: err };
  }
};

// Remove chapter
const removeChapter = async (bucketName, chapterName) => {
  return new Promise((resolve, reject) => {
    const objectsList = [];

    const objectsStream = minioClient.listObjects(
      bucketName,
      chapterName,
      true
    );

    objectsStream.on('data', function (obj) {
      objectsList.push(obj.name);
    });

    objectsStream.on('error', function (e) {
      console.log(e);
      reject({ success: false, error: e });
    });

    objectsStream.on('end', function () {
      minioClient.removeObjects(bucketName, objectsList, function (err) {
        if (err) {
          reject({ success: false, error: err });
        } else {
          resolve({ success: true });
        }
      });
    });
  });
};

module.exports = {
  removeImage,
  imageExists,
  uploadImage,
  removeChapter,
  chapterExists,
};
