const express = require('express');

const { getHomePage } = require('../controllers/homeController.js');
const { getComicPage } = require('../controllers/comicController.js');
const { getChapterPage } = require('../controllers/chapterController.js');
const { getUserInfoByToken } = require('../controllers/userInfoController.js');
const {
  handleLogin,
  handleRegister,
  handleResetPassword,
  handleForgotPassword,
} = require('../controllers/authController.js');

const router = express.Router();

// Pages
router.get('/api/home', getHomePage);
router.get('/api/comic/:comicId', getComicPage);
router.get('/api/chapter/:chapterId', getChapterPage);

// User info
router.get('/api/user', getUserInfoByToken);

// Auth
router.post('/api/auth/login', handleLogin);
router.post('/api/auth/register', handleRegister);
router.post('/api/auth/reset-password', handleResetPassword);
router.post('/api/auth/forgot-password', handleForgotPassword);

module.exports = router;
