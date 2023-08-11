const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let userSchema = mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    mobile_number: { type: String },
    country_code: { type: String },
    email: { type: String, lowercase: true },
    password: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", userSchema);
