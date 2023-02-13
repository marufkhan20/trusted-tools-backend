const Conversation = require("../model/Conversation");
const Message = require("../model/Message");
const Order = require("../model/Order");
const User = require("../model/User");

// get all orders
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await Order.find().populate([
      "service",
      "user",
      "paymentMethod",
    ]);
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// create a new order controller
const createNewOrderController = async (req, res) => {
  try {
    const { userId } = req.user || {};
    const admin = await User.findOne({ role: "admin" });

    const {
      packageName,
      packagePrice,
      pakcageDescription,
      paymentMethod,
      paymentNumber,
      transactionId,
      service,
    } = req.body || {};

    const newOrder = new Order({
      packageName,
      packagePrice,
      pakcageDescription,
      paymentMethod,
      paymentNumber,
      transactionId,
      service,
      user: userId,
      orderDate: Date.now(),
    });

    // create conversation
    const newConversation = new Conversation({
      participants: [admin?._id, userId],
      order: newOrder?._id,
      createdDate: Date.now(),
      messages: [],
    });

    await newConversation.save();

    // create order place message
    const newMessage = new Message({
      sender: userId,
      receiver: admin?._id,
      message: "Order Place Successfully.",
      createdDate: Date.now(),
      type: "orderPlace",
    });

    await newMessage.save();

    // update conversation with new message id
    if (newMessage?._id) {
      newConversation.messages = [
        ...newConversation?.messages,
        newMessage?._id,
      ];

      await newConversation.save();
    }

    // update order by conversation
    newOrder.conversation = newConversation?._id;

    await newOrder.save();

    res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// get all orders by user id controller
const getAllOrdersByUserIdController = async (req, res) => {
  try {
    const { id, status } = req.params || {};

    let orders;

    orders = await Order.find({ user: id }).populate("service");

    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// get single order by order id controller
const getSingleOrderController = async (req, res) => {
  try {
    const { orderId } = req.params || {};
    const order = await Order.findById(orderId).populate(["service", "user"]);

    res.status(200).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

// update order status controller
const updateOrderStatusController = async (req, res) => {
  try {
    const { orderId, status } = req.params || {};
    const { userId } = req.user || {};

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { status },
      },
      { new: true }
    ).populate(["service", "user", "conversation"]);

    if (status !== "delivered") {
      // create new message
      let newMessage;
      if (status === "progress") {
        newMessage = new Message({
          sender: userId,
          receiver: updatedOrder?.user,
          message: "Order Approved",
          type: "orderApproved",
          createdDate: Date.now(),
        });
      } else if (status === "rejected") {
        newMessage = new Message({
          sender: userId,
          receiver: updatedOrder?.user,
          message: "Order Rejected",
          type: "orderRejected",
          createdDate: Date.now(),
        });
      } else if (status === "completed") {
        newMessage = new Message({
          sender: userId,
          receiver: updatedOrder?.user,
          message: "Order has been completed",
          type: "orderCompleted",
          createdDate: Date.now(),
        });
      }

      await newMessage.save();

      // update conversation
      const conversation = await Conversation.findById(
        updatedOrder?.conversation
      );

      conversation.messages = [...conversation?.messages, newMessage?._id];
      await conversation.save();
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error Occurred!!",
    });
  }
};

module.exports = {
  getAllOrdersController,
  createNewOrderController,
  getAllOrdersByUserIdController,
  getSingleOrderController,
  updateOrderStatusController,
};
