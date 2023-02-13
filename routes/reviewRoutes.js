const {
  createReviewController,
  getReviewByOrderId,
} = require("../controllers/reviewController");
const checkAuth = require("../middlewares/authMiddleware");

const router = require("express").Router();

// creat new review
router.post("/", checkAuth, createReviewController);

// get review by order id
router.get("/:orderId", checkAuth, getReviewByOrderId);

module.exports = router;
