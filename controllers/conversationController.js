const Conversation = require("../model/Conversation");
const Message = require("../model/Message");
const User = require("../model/User");
const Jimp = require("jimp");
const path = require("path");

// get inbox all conversation controller
const getInboxAllConversationsController = async (req, res) => {
  try {
    const conversations = await Conversation.find({ inbox: true }).populate(
      "participants"
    );
    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// get single conversation by conversation id and order id controller
const getConversationController = async (req, res) => {
  try {
    const { conversationId, orderId } = req.params || {};

    console.log("conversation id: " + conversationId);
    console.log("order id: ", orderId);

    let conversation;

    if (conversationId && orderId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        order: orderId,
        // participants: [userId],
      }).populate("messages");
    }

    res.status(200).json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// get single conversation by conversationId
const getConversationByConversationIdController = async (req, res) => {
  try {
    const { conversationId } = req.params || {};

    const conversation = await Conversation.findById(conversationId).populate(
      "messages"
    );
    res.status(200).json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// get inbox conversation controller
const getInboxConversationController = async (req, res) => {
  try {
    const { userId } = req.user || {};

    // get admin
    const admin = await User.findOne({ role: "admin" });

    const conversation = await Conversation.findOne({
      participants: [admin?._id, userId],
      inbox: true,
    }).populate("messages");

    res.status(200).json(conversation);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// send message controller
const sendMessageController = async (req, res) => {
  try {
    const { message, orderId, file, fileName, link, type, conversationId } =
      req.body || {};
    const { userId, role } = req.user || {};

    // get admin
    const admin = await User.findOne({ role: "admin" });

    let imagePath;

    if (fileName) {
      // upload image
      const buffer = Buffer.from(
        file?.replace(/^data:image\/(png|jpg|jpeg|webp);base64,/, ""),
        "base64"
      );

      imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

      try {
        const jimpResp = await Jimp.read(buffer);
        jimpResp.write(
          path.resolve(__dirname, `../public/storage/messageFiles/${imagePath}`)
        );
      } catch (err) {
        console.log(err);
        return res.status(500).json({
          error: "Could not process the image!!",
        });
      }
    }

    // create new message
    let newMessage;

    if (orderId && role === "user") {
      console.log("user");
      newMessage = new Message({
        message,
        createdDate: Date.now(),
        sender: userId,
        receiver: admin?._id,
        file: file ? `/storage/messageFiles/${imagePath}` : "",
        fileName,
        link,
        type: type || "message",
      });

      await newMessage.save();
    } else if (role === "admin" && (orderId || conversationId)) {
      let conversation;

      if (conversationId) {
        conversation = await Conversation.findById(conversationId);
      } else {
        conversation = await Conversation.findOne({ order: orderId });
      }

      newMessage = new Message({
        message,
        createdDate: Date.now(),
        sender: userId,
        receiver: conversation?.participants[1],
        file: file ? `/storage/messageFiles/${imagePath}` : "",
        fileName,
        link,
        type: type || "message",
      });

      await newMessage.save();
    }

    // create new conversation
    if (!orderId && role === "user") {
      newMessage = new Message({
        message,
        createdDate: Date.now(),
        sender: userId,
        receiver: admin?._id,
        file: file ? `/storage/messageFiles/${imagePath}` : "",
        fileName,
        link,
        type: type || "message",
      });

      await newMessage.save();

      const conversation = await Conversation.findOne({
        participants: [admin?._id, userId],
        inbox: true,
      });

      if (!conversation) {
        const newConversation = new Conversation({
          participants: [admin?._id, userId],
          messages: [newMessage?._id],
          inbox: true,
          message,
        });

        await newConversation.save();
      } else {
        conversation.messages = [...conversation?.messages, newMessage?._id];
        conversation.message = message;
        await conversation.save();
      }
    }

    if (role === "admin" && conversationId) {
      const conversation = await Conversation.findById(conversationId);
      conversation.messages = [...conversation?.messages, newMessage?._id];
      conversation.message = message;
      await conversation.save();
    }

    // update conversation
    if (orderId) {
      const conversation = await Conversation.findOne({ order: orderId });
      conversation.messages = [...conversation?.messages, newMessage?._id];
      conversation.message = message;
      await conversation.save();
    }

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

module.exports = {
  getInboxAllConversationsController,
  getConversationByConversationIdController,
  getConversationController,
  getInboxConversationController,
  sendMessageController,
};
