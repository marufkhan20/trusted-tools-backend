const { Schema, model } = require("mongoose");

const paymentMethodSchema = new Schema(
  {
    methodName: {
      type: String,
      required: true,
    },
    paymentDetails: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

const PaymentMethod = model("PaymentMethod", paymentMethodSchema);

module.exports = PaymentMethod;
