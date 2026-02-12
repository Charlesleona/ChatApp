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
