const authRoutes = require("./authRoutes.js");
const userRoutes = require("./userRoutes.js");
const comicRoutes = require("./comicRoutes.js");
const chapterRoutes = require("./chapterRoutes.js");
const commentRoutes = require("./commentRoutes.js");

const declareRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/comics", comicRoutes);
  app.use("/api/chapters", chapterRoutes);
  app.use("/api/comments", commentRoutes);
};

module.exports = declareRoutes;
