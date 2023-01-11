const {
  getUserByUserIdController,
  updateUserProfileController,
  updateProfilePicController,
  getAllusersController,
} = require("../controllers/userController");
const checkAdminAuth = require("../middlewares/adminAuthMiddleware");
const checkAuth = require("../middlewares/authMiddleware");

const router = require("express").Router();

// get all users
router.get("/", checkAdminAuth, getAllusersController);

router.get("/:userId", checkAuth, getUserByUserIdController);

// update user profile
router.patch("/profile/:userId", checkAuth, updateUserProfileController);

// update profile pic
router.patch(
  "/profile/profile-pic/:userId",
  checkAuth,
  updateProfilePicController
);

module.exports = router;
