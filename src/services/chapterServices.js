const axios = require('axios');
const connection = require('../config/database');
const minioClient = require('../config/minIO');

const { sortByLastNumber } = require('../utils');

// List images in a bucket
const getImagesOfChapter = async (
  bucketName = 'ajin',
  prefix = 'Ajin Chapter 009',
  recursive = true
) => {
  try {
    const images = [];
    const stream = minioClient.listObjects(bucketName, prefix, recursive);

    for await (const obj of stream) {
      images.push(obj);
    }

    const imageNames = sortByLastNumber(images.map((object) => object.name));

    const imageUrlPromises = imageNames.map(async (name) => {
      // Public URL
      // const minioHost = process.env.REACT_APP_MIO_END_POINT;
      // const minioPort = process.env.REACT_APP_MIO_PORT;
      // return `http://${minioHost}:${minioPort}/${bucketName}/${name}`;
      // Presigned URL
      const url = await minioClient.presignedGetObject(bucketName, name);
      return url;
    });

    // Wait for all promises to complete
    const imageUrls = await Promise.all(imageUrlPromises);

    console.log('List images:', imageUrls);

    return { success: true, list: imageUrls };
  } catch (err) {
    console.error('Error listing images:', err);
    return { success: false, error: err };
  }
};

module.exports = {
  getImagesOfChapter,
};
