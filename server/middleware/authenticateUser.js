const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // replace with your secret
    req.user = decoded; // attach user info to req
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret"); // replace with your secret
    req.user = decoded; // attach user info to req
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
