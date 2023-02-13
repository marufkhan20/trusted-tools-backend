const router = require("express").Router();
const {
  addNewPaymentMethodController,
  getAllPaymentMethodsController,
  deletePaymentMethodController,
  updatePaymentMethodController,
  getAllActivePaymentMethodsController,
} = require("../controllers/paymentMethodController");
const checkAdminAuth = require("../middlewares/adminAuthMiddleware");

// get all payment methods
router.get("/", checkAdminAuth, getAllPaymentMethodsController);

// get all active payment methods
router.get("/active", getAllActivePaymentMethodsController);

// add new payment method
router.post("/", checkAdminAuth, addNewPaymentMethodController);

// delete payment method
router.delete("/:id", checkAdminAuth, deletePaymentMethodController);

// update payment method
router.patch("/:id", checkAdminAuth, updatePaymentMethodController);

module.exports = router;
