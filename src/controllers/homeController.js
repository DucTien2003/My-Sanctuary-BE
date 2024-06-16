const connection = require('../config/database.js');

const {
  //   createUser,
  getAllModel,
  //   getUserById,
  //   updateUserById,
  //   deleteUserById,
} = require('../services/comicServices');

const getHomePage = async (req, res) => {
  let results = await getAllModel();
  res.json(results);
};

// const postCreateUser = async (req, res) => {
//   let { email, name, city } = req.body;
//   await createUser(email, name, city);
//   res.redirect('/');
// };

// const getCreateUser = (req, res) => {
//   res.render('createUser.ejs');
// };

// const getUpdateUser = async (req, res) => {
//   const userId = req.params.id;
//   const userInfo = await getUserById(userId);
//   res.render('updateUser.ejs', { userInfo: userInfo });
// };

// const postUpdateUser = async (req, res) => {
//   let { id, email, name, city } = req.body;
//   await updateUserById(id, email, name, city);
//   res.redirect('/');
// };

// const postDeleteUserById = async (req, res) => {
//   const userId = req.params.id;
//   await deleteUserById(userId);
//   res.redirect('/');
// };

module.exports = {
  getHomePage,
  // getCreateUser,
  // getUpdateUser,
  // postCreateUser,
  // postUpdateUser,
  // postDeleteUserById,
};
