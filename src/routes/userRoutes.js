const express = require("express");
const authenticateToken = require("../middleware/authenticateToken.js");

const {
  handleGetUserByMyId,
  handleGetComicsByMyId,
  handleGetUserByUserId,
  handleGetComicsByUserId,
} = require("../controllers/userController.js");

const router = express.Router();

router.get("/my", authenticateToken, handleGetUserByMyId);
router.get("/my/comics", authenticateToken, handleGetComicsByMyId);

router.get("/:userId", handleGetUserByUserId);
router.get("/:userId/comics", handleGetComicsByUserId);

module.exports = router;
