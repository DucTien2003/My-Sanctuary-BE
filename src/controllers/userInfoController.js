const jwt = require('jsonwebtoken');
const { getUserByUsername } = require('../services/userServices');

const getUserInfoByToken = async (req, res) => {
  const token = req.headers.token;

  if (token == null) {
    return res.status(401).json({}); // Unauthorized
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      return res.status(403).json({}); // Forbidden
    }

    Promise.all([getUserByUsername(payload.username)])
      .then((values) => {
        const { name, avatar, email, username, publish_at } = values[0];
        res.json({ name, avatar, email, username, publish_at });
      })
      .catch((error) => {
        console.log('Error: ', error);
        res.status(500).json({});
      });
  });
};

// const postCreateUser = async (req, res) => {
//   let { email, name, city } = req.body;
//   await createUser(email, name, city);
//   res.redirect('/');
// };

module.exports = {
  getUserInfoByToken,
};
