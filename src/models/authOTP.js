const mongoose = require("mongoose");

const AuthOTPSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    require: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600, // this is the expiry time in seconds
  },
});

module.exports = mongoose.model("auth_otp", AuthOTPSchema);
