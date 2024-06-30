const express = require('express');
const authenticateToken = require('../middleware/authenticateToken.js');

const {
  getUserInfoById,
  getUserInfoByToken,
} = require('../controllers/userController.js');

const router = express.Router();

router.get('/auth', getUserInfoByToken);
router.get('/:userId', getUserInfoById);

module.exports = router;
