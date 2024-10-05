import { Conversation } from "../Models/conversationModel.js";
import { getRecevierSocketID } from "../socketIo/socket.js";
import { Message } from "../Models/messageModel.js";
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;
    const { textMessage: message } = req.body;
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    //establish the conversation if not started yet

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      recieverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    //Implement socket io for real time data transfer
    const recieverSocketId = getRecevierSocketID(recieverId);
    if (recieverId) {
      io.to(recieverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    }).populate('message');
    if (!conversation) {
      return res.status(200).json({ success: true, message: [] });
    }

    return res.status(200).json({
      success: true,
      message: conversation?.messages,
    });
  } catch (error) {
    console.log(error);
  }
};
