const Order = require("../model/Order");
const Review = require("../model/Review");
const Service = require("../model/Service");

// get review by order id controller
const getReviewByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params || {};
    const review = await Review.findOne({ order: orderId });
    res.status(200).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// create new review controller
const createReviewController = async (req, res) => {
  try {
    const { rating, description, order, service } = req.body || {};
    const { userId } = req.user || {};

    let newReview;

    if (order && service) {
      newReview = new Review({
        rating,
        description,
        order,
        service,
        user: userId,
      });
    } else {
      newReview = new Review({
        rating,
        description,
        service,
        user: userId,
      });
    }

    await newReview.save();

    if (order) {
      await Order.findByIdAndUpdate(order, {
        $set: { review: newReview?._id },
      });
    }

    if (service) {
      const oldService = await Service.findById(service);
      oldService.reviews = [...oldService?.reviews, newReview?._id];
      await oldService.save();
    }

    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

module.exports = {
  createReviewController,
  getReviewByOrderId,
};
