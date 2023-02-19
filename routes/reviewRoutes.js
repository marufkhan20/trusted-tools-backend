const {
  createReviewController,
  getReviewByOrderId,
  getReviewsByServiceIdController,
  getAllReviewsController,
} = require("../controllers/reviewController");
const checkAuth = require("../middlewares/authMiddleware");

const router = require("express").Router();

// get all reviews
router.get("/", getAllReviewsController);

// get reviews by service id
router.get("/service-reviews/:id", getReviewsByServiceIdController);

// creat new review
router.post("/", checkAuth, createReviewController);

// get review by order id
router.get("/:orderId", checkAuth, getReviewByOrderId);

module.exports = router;
