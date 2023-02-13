const { Schema, model } = require("mongoose");

const conversationSchema = new Schema(
  {
    participants: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    message: {
      type: String,
    },
    createdDate: {
      type: Number,
    },
    messages: {
      type: [Schema.Types.ObjectId],
      ref: "Message",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    inbox: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Conversation = model("Conversation", conversationSchema);

module.exports = Conversation;
