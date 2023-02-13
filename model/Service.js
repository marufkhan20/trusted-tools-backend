const { model, Schema } = require("mongoose");

const serviceSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortDescription: String,
    serviceImages: {
      type: [String],
      required: true,
    },
    basicName: String,
    basicPrice: String,
    basicDelivery: String,
    basicRevision: String,
    basicDescription: String,
    standardName: String,
    standardPrice: String,
    standardDelivery: String,
    standardRevision: String,
    standardDescription: String,
    premiumName: String,
    premiumPrice: String,
    premiumDelivery: String,
    premiumRevision: String,
    premiumDescription: String,
    fullDescription: String,
    reviews: {
      type: [Schema.Types.ObjectId],
      ref: "Review",
    },
    orders: {
      type: [Schema.Types.ObjectId],
      ref: "Order",
    },
  },
  { timestamps: true }
);

const Service = model("Service", serviceSchema);

module.exports = Service;
