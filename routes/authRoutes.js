const {
  addNewUserController,
  verifyAccountController,
  loginController,
} = require("../controllers/authController");

const router = require("express").Router();

router.post("/register", addNewUserController);

router.get("/verify-account/:userId", verifyAccountController);

router.post("/login", loginController);

module.exports = router;
