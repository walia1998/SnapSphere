import { Conversation } from "../Models/conversationModel.js";

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;
    const { message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    //establish the conversation if not started yet

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, recieverId],
      });
    }

    const newMassage = await message.create({
      senderId,
      recieverId,
      message,
    });

    if (newMessage) conversation.messages.push(newMassage._id);

    await Promise.all([conversation.save(), newMassage.save()]);

    //Implement socket io for real time data transfer

    return res.status(201).json({
      success: true,
      newMassage,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const recieverId = req.params.id;

    const conversation = await Conversation.find({
      participants: { $all: [senderId, recieverId] },
    });
    if (!conversation) {
        return res.status(200).json({ success: true, message: [] });
    }
      
    return res.status(200).json({
      success: true,
      message: conversation.messages,
    });
  } catch (error) {
    console.log(error);
  }
};
