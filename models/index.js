require("dotenv").config();
const config = require("../config/config");
const { Sequelize } = require("sequelize");

// Import models
const UserModel = require("./user.model");
const GenreModel = require("./genre.model");
const ComicModel = require("./comic.model");
const ChapterModel = require("./chapter.model");
const ImageModel = require("./image.model");
const CommentModel = require("./comment.model");
const ComicGenreModel = require("./comicGenre.model");
const RatingComicUserModel = require("./ratingComicUser.model");
const BookmarkComicUserModel = require("./bookmarkComicUser.model");
const LikeDislikeCommentModel = require("./likeDislikeComment.model");

// Database configuration
const env = process.env.NODE_ENV || "development";
const { database, username, password, host, dialect } = config[env];

// Database connection
const sequelize = new Sequelize(database, username, password, {
  host,
  dialect,
});

// Models
const User = UserModel(sequelize, Sequelize.DataTypes);
const Genre = GenreModel(sequelize, Sequelize.DataTypes);
const Comic = ComicModel(sequelize, Sequelize.DataTypes);
const Chapter = ChapterModel(sequelize, Sequelize.DataTypes);
const Image = ImageModel(sequelize, Sequelize.DataTypes);
const Comment = CommentModel(sequelize, Sequelize.DataTypes);
const ComicGenre = ComicGenreModel(sequelize, Sequelize.DataTypes);
const RatingComicUser = RatingComicUserModel(sequelize, Sequelize.DataTypes);
const BookmarkComicUser = BookmarkComicUserModel(
  sequelize,
  Sequelize.DataTypes
);
const LikeDislikeComment = LikeDislikeCommentModel(
  sequelize,
  Sequelize.DataTypes
);

// Setup relationships
// User
User.hasMany(Comic, { foreignKey: "poster_id", sourceKey: "id" });
User.hasMany(Comment, { foreignKey: "user_id", sourceKey: "id" });
User.hasMany(RatingComicUser, { foreignKey: "user_id", sourceKey: "id" });
User.hasMany(BookmarkComicUser, { foreignKey: "user_id", sourceKey: "id" });
User.hasMany(LikeDislikeComment, { foreignKey: "user_id", sourceKey: "id" });

// Genre
Genre.belongsToMany(Comic, {
  through: ComicGenre,
  foreignKey: "genre_id",
  otherKey: "comic_id",
});

// Comic
Comic.belongsTo(User, { foreignKey: "poster_id", targetKey: "id" });
Comic.hasMany(Chapter, { foreignKey: "comic_id", sourceKey: "id" });
Comic.hasMany(Comment, { foreignKey: "comic_id", sourceKey: "id" });
Comic.hasMany(RatingComicUser, { foreignKey: "comic_id", sourceKey: "id" });
Comic.hasMany(BookmarkComicUser, { foreignKey: "comic_id", sourceKey: "id" });
Comic.belongsToMany(Genre, {
  through: ComicGenre,
  foreignKey: "comic_id",
  otherKey: "genre_id",
});

// Chapter
Chapter.belongsTo(Comic, { foreignKey: "comic_id", targetKey: "id" });
Chapter.hasMany(Image, { foreignKey: "chapter_id", sourceKey: "id" });
Chapter.hasMany(Comment, { foreignKey: "chapter_id", sourceKey: "id" });

// Image
Image.belongsTo(Chapter, { foreignKey: "chapter_id", targetKey: "id" });

// Comment
Comment.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });
Comment.belongsTo(Comic, { foreignKey: "comic_id", targetKey: "id" });
Comment.belongsTo(Chapter, { foreignKey: "chapter_id", targetKey: "id" });
Comment.hasMany(LikeDislikeComment, {
  foreignKey: "comment_id",
  sourceKey: "id",
});

// ComicGenre
ComicGenre.belongsTo(Comic, { foreignKey: "comic_id", targetKey: "id" });
ComicGenre.belongsTo(Genre, { foreignKey: "genre_id", targetKey: "id" });

// RatingComicUser
RatingComicUser.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });
RatingComicUser.belongsTo(Comic, { foreignKey: "comic_id", targetKey: "id" });

// BookmarkComicUser
BookmarkComicUser.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });
BookmarkComicUser.belongsTo(Comic, { foreignKey: "comic_id", targetKey: "id" });

// LikeDislikeComment
LikeDislikeComment.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });
LikeDislikeComment.belongsTo(Comment, {
  foreignKey: "comment_id",
  targetKey: "id",
});

module.exports = {
  sequelize,
  User,
  Genre,
  Comic,
  Chapter,
  Image,
  Comment,
  ComicGenre,
  RatingComicUser,
  BookmarkComicUser,
  LikeDislikeComment,
};
