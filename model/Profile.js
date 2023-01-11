const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  profilePic: String,
  bio: String,
  phone: String,
  facebook: String,
  website: String,
  instagram: String,
  twitter: String,
  linkedin: String,
  youtube: String,
  address: String,
  address2: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
});

const Profile = model("Profile", profileSchema);

module.exports = Profile;
