// Get all users expect the logged in user

import Message from "../models/Message.js";
import User from "../models/user.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUser = await User.find({ _id: { $ne: userId } }).select(
      "-password",
    );
    // count number of messages not seen
    const unseenMessage = {};
    const promises = filteredUser.map(async (user) => {
      const message = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (message.length > 0) {
        unseenMessage[user._id] = message.length;
      }
    });
    await promises.all(promises);
    res.json({ success: true, user: filteredUser, unseenMessage });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get all message for selected user

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUSerId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUSerId },
        { senderId: selectedUSerId, receiverId: myId },
      ],
    });
    await Message.updateMany(
      {
        senderId: selectedUSerId,
        receiverId: myId,
      },
      { seen: true },
    );
    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// api to mark message as seen
export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
