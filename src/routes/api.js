const authRoutes = require("./authRoutes.js");
const userRoutes = require("./userRoutes.js");
const comicRoutes = require("./comicRoutes.js");
const chapterRoutes = require("./chapterRoutes.js");
const commentRoutes = require("./commentRoutes.js");

const declareRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/comic", comicRoutes);
  app.use("/api/chapter", chapterRoutes);
  app.use("/api/comment", commentRoutes);
};

module.exports = declareRoutes;
