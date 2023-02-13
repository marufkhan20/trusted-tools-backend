const PaymentMethod = require("../model/PaymentMethod");

// get all the payment methods controller
const getAllPaymentMethodsController = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find();
    res.status(200).json(paymentMethods);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// get all active payment methods controller
const getAllActivePaymentMethodsController = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ status: "active" });
    res.status(200).json(paymentMethods);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// add new payment method controller
const addNewPaymentMethodController = async (req, res) => {
  try {
    const { methodName, paymentDetails } = req.body || {};

    const newPaymentMethod = new PaymentMethod({
      methodName,
      paymentDetails,
    });
    await newPaymentMethod.save();

    res.status(201).json(newPaymentMethod);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error occurred",
    });
  }
};

// delete payment method controller
const deletePaymentMethodController = async (req, res) => {
  try {
    const { id } = req.params || {};

    const deletedPaymentMethod = await PaymentMethod.findByIdAndDelete(id);

    res.status(200).json(deletedPaymentMethod);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error Occurred!",
    });
  }
};

// update payment method controller
const updatePaymentMethodController = async (req, res) => {
  try {
    const { id } = req.params || {};

    const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(
      id,
      {
        $set: req.body || {},
      },
      { new: true }
    );

    res.status(200).json(updatedPaymentMethod);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error Occurred!",
    });
  }
};

module.exports = {
  getAllPaymentMethodsController,
  getAllActivePaymentMethodsController,
  addNewPaymentMethodController,
  deletePaymentMethodController,
  updatePaymentMethodController,
};
