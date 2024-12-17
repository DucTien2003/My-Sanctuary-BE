const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const accessToken = req.headers.accesstoken;

  // Unauthorized
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Access token not found",
    });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          success: false,
          message: "Access token expired",
          isAccessTokenExpired: true,
        }); // Unauthorized
      } else {
        return res.status(403).json({
          success: false,
          message: "Access token invalid",
        }); // Forbidden
      }
    }

    req.id = payload.id;
    req.role = payload.role;

    return next();
  });
}

module.exports = authenticateToken;
