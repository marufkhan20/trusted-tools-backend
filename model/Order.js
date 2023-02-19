const { Schema, model } = require("mongoose");

const orderSchema = new Schema(
  {
    packageName: String,
    packagePrice: Number,
    pakcageDescription: String,
    paymentMethod: {
      type: Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    paymentNumber: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "rejected", "accepted"],
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },
    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "rejected",
        "progress",
        "completed",
        "delivered",
        "revision",
        "canelled",
      ],
    },
    review: {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
    orderDate: Number,
    screenshot: String,
  },
  { timestamps: true }
);

const Order = model("Order", orderSchema);

module.exports = Order;
