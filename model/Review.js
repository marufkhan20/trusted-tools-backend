const { Schema, model } = require("mongoose");

const reviewSchema = new Schema(
  {
    rating: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    service: {
      type: Schema.Types.ObjectId,
      ref: "Service",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Review = model("Review", reviewSchema);

module.exports = Review;
