const jwt = require("jsonwebtoken");

const getInfoToken = (req, res, next) => {
  const accessToken = req.headers.accesstoken;

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      // Handle error
      req.id = null;
      req.role = null;

      return next();
    }

    req.id = payload.id;
    req.role = payload.role;

    return next();
  });
};

module.exports = getInfoToken;
