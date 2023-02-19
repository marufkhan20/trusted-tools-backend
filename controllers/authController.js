const User = require("../model/User");
const bcrypt = require("bcrypt");
const Profile = require("../model/Profile");
const {
  registerValidator,
  loginValidator,
} = require("../validation/authValidator");
const sendMail = require("../services/emailService");
const jwt = require("jsonwebtoken");

// add new user controller
const addNewUserController = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body || {};

    // check validation
    const validationError = registerValidator(req.body);

    if (Object.keys(validationError).length > 0) {
      return res.status(422).json({
        error: validationError,
      });
    }

    // check user exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        error: {
          email: "User already exists",
        },
      });
    }

    // password hashed
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "server Error" });
        }

        if (hash) {
          // create new user
          const newUser = new User({
            email,
            password: hash,
          });

          // create new profile for this user
          let newProfile;
          if (newUser?._id) {
            newProfile = new Profile({
              firstName,
              lastName,
              user: newUser._id,
            });

            await newProfile.save();
          }

          // update user by profile id
          if (newProfile?._id) {
            newUser.profile = newProfile?._id;
          }

          // save user in db
          await newUser.save();

          // send verification email
          if (newUser?._id) {
            const verifyLink = `${process.env.SITE_URL}/verify-account/${newUser._id}/${newProfile?._id}`;

            sendMail({
              from: process.env.ADMIN_EMAIL,
              to: email,
              subject: "Verify Your Account.",
              html: require("../services/emailTemplate")(verifyLink),
            });
          }

          // send response
          res.status(201).json({
            message: "User saved successfully",
            user: newUser,
          });
        }
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};

// verify acccount controller
const verifyAccountController = async (req, res) => {
  try {
    const { userId } = req.params || {};

    if (!userId) {
      return res.status(400).json({
        error: "User Id is required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // update user
    user.verified = true;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account Verify Successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};

// login controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // check validation
    const validationError = loginValidator(req.body);

    if (Object.keys(validationError).length > 0) {
      return res.status(400).json({ error: validationError });
    }

    // check user available
    const user = await User.findOne({ email }).populate("profile");

    // check user exists
    if (!user) {
      return res.status(400).json({
        error: {
          email: "User not found! Please try again!!",
        },
      });
    }

    // check user account verified
    // if (user?._id && !user?.verified) {
    //   return res.status(400).json({
    //     error: {
    //       email: "Account not verified! Please verify your account!!",
    //     },
    //   });
    // }

    // check password correct or incorrect
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res.status(500).json({
          error: "Server Error Occurred!",
        });
      }

      if (!result) {
        return res.status(400).json({
          error: {
            password: "Email or Password Incorrect!",
          },
        });
      }

      // prepare the user object to generate token
      const userObject = {
        userId: user._id,
        profileId: user?.profile?._id,
        firstName: user.profile?.firstName,
        lastName: user.profile?.lastName,
        email: user.email,
        role: user.role || "user",
        profilePic: user.profile?.profilePic,
      };

      // generate token
      const token = jwt.sign(userObject, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY,
      });

      res.status(200).json({
        user: userObject,
        token,
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
};

module.exports = {
  addNewUserController,
  verifyAccountController,
  loginController,
};
