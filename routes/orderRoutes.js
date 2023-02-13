const router = require("express").Router();
const {
  createNewOrderController,
  getAllOrdersByUserIdController,
  getSingleOrderController,
  updateOrderStatusController,
  getAllOrdersController,
} = require("../controllers/orderController");
const checkAuth = require("../middlewares/authMiddleware");
const checkAdminAuth = require("../middlewares/adminAuthMiddleware");

// get all orders
router.get("/", checkAdminAuth, getAllOrdersController);

// create a new order
router.post("/", checkAuth, createNewOrderController);

// get all orders by user id
router.get("/:id/:status", checkAuth, getAllOrdersByUserIdController);

// get single order by order id
router.get("/:orderId", checkAuth, getSingleOrderController);

// update order status
router.patch("/:orderId/:status", checkAuth, updateOrderStatusController);

module.exports = router;
