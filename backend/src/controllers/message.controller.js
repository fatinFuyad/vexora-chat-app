import { uploadImage } from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export async function getUsersForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId }
    }).select("-password");

    res.status(200).json({
      status: "success",
      users: filteredUsers
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
}

export async function getMessages(req, res) {
  try {
    const userId = req.user._id;
    const userToChatId = req.params.id;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: userId }
      ]
    });

    res.status(200).json({
      status: "success",
      messages
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
}

export async function sendMessage(req, res) {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id;
    const receiverId = req.params.id;

    let imageUrl;
    if (image) {
      imageUrl = await uploadImage(image);
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    // IMPLEMENT REALTIME MESSAGEING WITH SOCKET.IO
    const receiverSocketId = getReceiverSocketId(receiverId); // we don't have access to the userSocketMap object but with a helper function exported from that module helps access the data
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({
      status: "success",
      message: newMessage
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message
    });
  }
}
