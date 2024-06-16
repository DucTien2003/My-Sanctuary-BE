const express = require('express');

const {
  getHomePage,
  // getCreateUser,
  // getUpdateUser,
  // postCreateUser,
  // postUpdateUser,
  // postDeleteUserById,
} = require('../controllers/homeController.js');
const { getChapterPage } = require('../controllers/chapterController.js');

const router = express.Router();

router.get('/', getHomePage);
router.get('/comic-name/chapter', getChapterPage);
// router.get('/update-user/:id', getUpdateUser);

// router.post('/handle-create-user', postCreateUser);
// router.post('/handle-update-user', postUpdateUser);
// router.post('/handle-delete-user/:id', postDeleteUserById);

module.exports = router;
