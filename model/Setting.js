const { Schema, model } = require("mongoose");

const settingSchema = new Schema({
  headerLogo: String,
  footerLogo: String,
});

const Setting = model("Setting", settingSchema);

module.exports = Setting;
