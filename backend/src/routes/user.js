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
  const user = new User({
    firstName,
    lastName,
    email,
    profilepic,
    password: passwordHash,
  });
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
      const token = jwt.sign({ _id: user._id }, "Dev@123", {
        expiresIn: "1d",
      });
      res.cookie("token", token, { expires: new Date(Date.now() + 900000) });
      res.send(user);
    } else {
      throw new Error("password incorrect");
    }
  } catch (error) {
    res.status(400).send("login failed" + error);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null);
  res.send("logout succesfull");
});

authRouter.put("/updateprofile", userAuth, async (req, res) => {
  try {
    // getting profilepic from signup api from USER model
    const { profilePic } = req.body;
    // from userAuth middleware getting _id
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(200).json({ message: "profile pic required" });
    }
    const uploadResponse = await cloudnary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    );
    res.status(200).send(updatedUser);
  } catch (error) {
    console.log("error in update profile", error.message);
    res.status(400).json({ message: "internal server error" });
  }
});

authRouter.get("/profile/view", userAuth, async (req, res) => {
  // Here we are reciving the token from login API
  // To read the cookie token we need external package cookie parser
  // Import it and give middleware app.use(cookieParser())
  try {
    // this user we are getting from auth middleware req
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(400).send("profile loading failed" + error);
  }
});

authRouter.get("/check", userAuth, async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("error in check auth controller");
    res.status(401).json({ message: "Internal server error" });
  }
});

module.exports = authRouter;
