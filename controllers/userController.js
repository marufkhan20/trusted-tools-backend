const User = require("../model/User");
const Profile = require("../model/Profile");
const Jimp = require("jimp");
const path = require("path");

// get all users controller
const getAllusersController = async (req, res) => {
  try {
    const { userId } = req.user;
    const users = await User.find({}).populate("profile");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error Occured",
    });
  }
};

// get user by user id controller
const getUserByUserIdController = async (req, res) => {
  try {
    const { userId } = req.params || {};

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    const user = await User.findById(userId).populate("profile");

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server Error Occurred",
    });
  }
};

// update user profile controller
const updateUserProfileController = async (req, res) => {
  try {
    const { userId } = req.params || {};

    console.log(req.body);

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    // update profile
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedProfile);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server Error Occurred",
    });
  }
};

// update profile pic controller
const updateProfilePicController = async (req, res) => {
  try {
    const { userId } = req.params || {};
    const { profilePic } = req.body || {};

    if (!userId) {
      return res.status(400).json({
        error: "userId is required",
      });
    }

    if (!profilePic) {
      return res.status(400).json({ error: "Profile Pic is Required!" });
    }

    console.log("hello");

    if (profilePic) {
      // upload image
      const buffer = Buffer.from(
        profilePic.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

      try {
        const jimpResp = await Jimp.read(buffer);
        jimpResp
          .resize(300, 300)
          .write(
            path.resolve(__dirname, `../public/storage/profile/${imagePath}`)
          );

        // update database
        if (imagePath) {
          const updatedProfile = await Profile.findOneAndUpdate(
            {
              user: userId,
            },
            { $set: { profilePic: `/storage/profile/${imagePath}` } },
            { new: true }
          );

          res.status(200).json(updatedProfile);
        }
      } catch (err) {
        return res.status(500).json({
          error: "Could not process the image!!",
        });
      }
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server Error Occurred",
    });
  }
};

module.exports = {
  getAllusersController,
  getUserByUserIdController,
  updateUserProfileController,
  updateProfilePicController,
};
