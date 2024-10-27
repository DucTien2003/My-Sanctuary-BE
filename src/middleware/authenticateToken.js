const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const token = req.headers.token;

  if (!token) {
    req.id = null;
    req.role = null;
    req.name = null;
    req.email = null;
    req.avatar = null;
    req.username = null;
    return next();
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({}); // Unauthorized
      } else {
        return res.status(403).json({}); // Forbidden
      }
    }

    req.id = payload.id;
    req.role = payload.role;
    req.name = payload.name;
    req.email = payload.email;
    req.avatar = payload.avatar;
    req.username = payload.username;

    return next();
  });
}

module.exports = authenticateToken;
