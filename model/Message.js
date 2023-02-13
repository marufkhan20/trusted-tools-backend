const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
    },
    createdDate: {
      type: Number,
    },
    type: {
      type: String,
      enum: [
        "message",
        "orderPlace",
        "orderApproved",
        "orderRejected",
        "orderDelevered",
        "orderCompleted",
        "messageWithFiles",
      ],
      default: "message",
    },
    file: {
      type: String,
    },
    fileName: String,
    link: String,
  },
  { timestamps: true }
);

const Message = model("Message", messageSchema);

module.exports = Message;
