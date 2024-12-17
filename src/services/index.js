const userServices = require("./userServices");
const chapterServices = require("./chapterServices");
const commentServices = require("./commentServices");
const comicServices = require("./comicServices");
const genreServices = require("./genreServices");
const authServices = require("./authServices");

module.exports = {
  ...authServices,
  ...chapterServices,
  ...commentServices,
  ...comicServices,
  ...genreServices,
  ...userServices,
};
