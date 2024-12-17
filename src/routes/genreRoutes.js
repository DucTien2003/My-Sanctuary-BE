const express = require("express");

const { handleGetGenres } = require("../controllers/genreController.js");

const router = express.Router();

router.get("/", handleGetGenres);

module.exports = router;
