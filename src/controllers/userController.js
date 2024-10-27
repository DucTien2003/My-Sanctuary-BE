const jwt = require("jsonwebtoken");
const { getUserById, getUserByUsername } = require("../services/userServices");

const getUserInfoById = async (req, res) => {
  const userId = req.params.userId;

  Promise.all([getUserById(userId)])
    .then((values) => {
      const { name, avatar, email, username, publishAt } = values[0];
      res.json({ name, avatar, email, username, publishAt });
    })
    .catch((error) => {
      console.log("Error getUserInfoById: ", error);
      res.status(500).json({});
    });
};

const getUserInfoByToken = async (req, res) => {
  const token = req.headers.token;

  if (!token) {
    return res.json({}); // Unauthorized
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      console.log("Error getUserInfoByToken: ", err);
      return res.json({}); // Forbidden
    }

    const username = payload.username;

    Promise.all([getUserByUsername(username)])
      .then((values) => {
        const { name, avatar, email, username, publishAt } = values[0];
        res.json({ name, avatar, email, username, publishAt });
      })
      .catch((error) => {
        console.log("Error: ", error);
        res.status(500).json({});
      });
  });
};

module.exports = {
  getUserInfoById,
  getUserInfoByToken,
};
