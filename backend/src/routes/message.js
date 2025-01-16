const express = require("express");
const userAuth = require("../middlewares/user");
const User = require("../models/user");
const Message = require("../models/message");

const messageRouter = express.Router();

// to get all the users except the loggedIn user
messageRouter.get("/users", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filterUser = await User.find({ _id: { $ne: loggedInUser } });

    res.send(filterUser);
  } catch (error) {
    res.status(400).send("users fetching failter" + error.message);
  }
});

// to get all the messages from MessageModel
messageRouter.get("/messages/:id", userAuth, async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const loggedInUser = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUser, reciverId: userToChat },
        { senderId: userToChat, reciverId: loggedInUser },
      ],
    });
    res.status(200).send(messages);
  } catch (error) {
    res.status(400).send("messages failed" + error.message);
  }
});

messageRouter.post("send/:id", userAuth, async (req, res) => {
  try {
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudnary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    res.status(200).json({ message: "message sent ", newMessage });
  } catch (error) {}
});

module.exports = messageRouter;
