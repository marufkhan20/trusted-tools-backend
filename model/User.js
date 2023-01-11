const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  orders: {
    type: [Schema.Types.ObjectId],
    ref: "Order",
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    required: true,
    default: "user",
  },
  reviews: {
    type: [Schema.Types.ObjectId],
    ref: "Review",
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = model("User", userSchema);

module.exports = User;
