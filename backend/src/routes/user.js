const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userAuth = require("../middlewares/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // creating new instance of user model
  const { firstName, lastName, email, password } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ firstName, lastName, email, password: passwordHash });
  //   the data coming from req.body is in json so for it we need middleware to convert data in json
  try {
    const data = await user.save();
    res.json({ message: "signup succesfully", data });
  } catch (error) {
    res.status(400).send("signup failed" + error);
  }
});

authRouter.post("/login", async (req, res) => {
  // we are getting email and password from req.body
  const { email, password } = req.body;
  try {
    // with validator library validating if user is valid
    if (!validator.isEmail(email)) {
      throw new Error("email not valid");
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("email not found");
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      const token = jwt.sign({ _id: user._id }, "Dev@123");
      res.cookie("token", token);
      res.send("login succesfull");
    } else {
      throw new Error("password incorrect");
    }
  } catch (error) {
    res.status(400).send("login failed" + error);
  }
});

authRouter.get("/profile", userAuth, async (req, res) => {
  const user = req.user;
  res.send(user);
});

module.exports = authRouter;
