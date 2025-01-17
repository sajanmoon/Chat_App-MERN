const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    if (!token) {
      return res.status(401).send("Please login");
    }

    try {
      const decodedMessage = jwt.verify(token, "Dev@123");

      const { _id } = decodedMessage;

      const user = await User.findById(_id);
      if (!user) {
        throw new Error("invalid user");
      }

      req.user = user;

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ error: "Invalid or expired token. Please login again." });
    }
  } catch (error) {
    res.status(400).send("error fetching token" + error);
  }
};

module.exports = userAuth;
