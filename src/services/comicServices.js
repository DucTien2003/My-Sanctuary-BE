const connection = require('../config/database');
const axios = require('axios');

const getSketchfabModelInfo = async (id) => {
  const url = `https://sketchfab.com/i/models/${id}/`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('There was a problem with function ApiInfoSketchfab:', error);
  }
};

const getModelStorage = (id) => {
  return {
    represent:
      'https://brightfuture.blob.core.windows.net/3dmodel/' +
      id +
      '/represent-image.png',
    url:
      'https://brightfuture.blob.core.windows.net/3dmodel/' +
      id +
      '/scene.gltf',
  };
};

// Merge model info in database and Sketchfab
const mergeModelInfo = async (rawModelInfo) => {
  const modelStorage = getModelStorage(rawModelInfo.id);

  const sketchfabModelInfo = await getSketchfabModelInfo(rawModelInfo.id);

  const modelInfo = {
    id: rawModelInfo.id,
    name: rawModelInfo.name,
    views: rawModelInfo.views,
    like: 10,
    isLike: false,
    downloads: rawModelInfo.downloads,
    release: rawModelInfo.releaseDate,
    description: rawModelInfo.description,
    categories: ['Animals & Pets'],
    author: {
      isFollow: false,
      name: 'Erina eka syaharani',
      avatar: sketchfabModelInfo.user.avatars.images[0].url,
    },
    represent: modelStorage.represent,
    setting: {
      url: modelStorage.url,
      backgroundColor: rawModelInfo.backgroundColor,
      camera: {
        cameraPosition: [
          rawModelInfo.cameraPositionX,
          rawModelInfo.cameraPositionY,
          rawModelInfo.cameraPositionZ,
        ],
        lookAt: [
          rawModelInfo.lookAtX,
          rawModelInfo.lookAtY,
          rawModelInfo.lookAtZ,
        ],
      },
      bloom: {
        isBloom: rawModelInfo.isBloom,
        parameter: [
          rawModelInfo.bloomParameterStrength,
          rawModelInfo.bloomParameterRadius,
          rawModelInfo.bloomParameterThreshold,
        ],
      },
      animation: {
        default: rawModelInfo.animationDefault,
        quantity: rawModelInfo.animationQuantity,
      },
    },
  };

  return modelInfo;
};

// const createUser = async (email, name, city) => {
//   let [results, fields] = await connection.query(
//     `insert into users (email, name, city) values (?, ?, ?)`,
//     [email, name, city],
//   );
// };

const getAllModel = async () => {
  let [allRawModel, fields] = await connection.query('SELECT * FROM models');

  const allModelPromises = allRawModel.map(mergeModelInfo);
  const allModel = await Promise.all(allModelPromises);

  return allModel;
};

// const getUserById = async (id) => {
//   let [results, fields] = await connection.query(
//     'SELECT * FROM users WHERE id = ?',
//     [id],
//   );
//   return results && results.length > 0 ? results[0] : {};
// };

// const updateUserById = async (id, email, name, city) => {
//   let [results, fields] = await connection.query(
//     `UPDATE users
//         SET email = ?, name = ?, city = ?
//         WHERE id = ?`,
//     [email, name, city, id],
//   );
// };

// const deleteUserById = async (id) => {
//   let [results, fields] = await connection.query(
//     `DELETE FROM users WHERE id = ?`,
//     [id],
//   );
// };

module.exports = {
  //   createUser,
  getAllModel,
  //   getUserById,
  //   updateUserById,
  //   deleteUserById,
};
