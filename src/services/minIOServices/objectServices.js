const path = require('path');

const minioClient = require('../../config/minIO');
const {
  bucketExists,
  createBucket,
  getListChapters,
} = require('./bucketServices');

// Check exists of a chapter
const chapterExists = async (bucketName, chapterName) => {
  const exists = await getListChapters(bucketName, chapterName);

  if (exists.success && exists.list.length > 0) {
    return { isExists: true, exists };
  } else {
    return { isExists: false, exists };
  }
};

// Upload chapter
const uploadChapter = async (bucketName, chapterName, images = [0, 1]) => {
  try {
    // Kiểm tra và tạo bucket nếu chưa tồn tại
    const isBucketExists = await bucketExists(bucketName);
    if (!isBucketExists.exists) {
      await createBucket(bucketName);
    }

    // Kiểm tra và tạo folder cho chapter nếu chưa tồn tại
    const isChapterExists = await chapterExists(bucketName, chapterName);
    console.log(isChapterExists);
    if (!isChapterExists.isExists) {
      const uploadPromises = images.map(async (image, index) => {
        const objectName = `${chapterName}/image_${index}.jpg`;
        const relativeFilePath = `src/assets/images/Darwins Game Chap 125 page 56.jpg`; // Đường dẫn tương đối đến ảnh
        const absoluteFilePath = path.resolve(relativeFilePath); // Chuyển đổi đường dẫn tương đối thành đường dẫn tuyệt đối
        await minioClient.fPutObject(bucketName, objectName, absoluteFilePath);
      });

      // Chờ tất cả các lượt upload hoàn thành
      await Promise.all(uploadPromises);
    }

    console.log(`Chapter ${chapterName} uploaded successfully!`);
    return { success: true };
  } catch (err) {
    console.error(`Error uploading chapter ${chapterName}:`, err);
    return { success: false, error: err };
  }
};

// Remove chapter
const removeChapter = async (bucketName, chapterName) => {
  const objectsList = [];

  // List all object paths in bucket my-bucketname.
  const objectsStream = minioClient.listObjects(bucketName, chapterName, true);

  objectsStream.on('data', function (obj) {
    objectsList.push(obj.name);
  });

  objectsStream.on('error', function (e) {
    console.log(e);
  });

  objectsStream.on('end', function () {
    minioClient.removeObjects(bucketName, objectsList, function (err) {
      if (err) {
        return { success: false, error: err };
      }
      return { success: true };
    });
  });
};

export { uploadChapter, removeChapter };
