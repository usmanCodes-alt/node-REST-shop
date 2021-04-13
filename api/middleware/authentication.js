const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // jwt.verify will verify a token and return a decoded value
    const decodedToken = jwt.verify(token, "SECRET");
    req.userData = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed!" });
  }
};
