const mongoose = require("mongoose");

const companyApplication = new mongoose.Schema({
  crNumber: { type: String },
  crName: { type: String },
  companyName: { type: String },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  reason: { type: String },
  appliedByUser: { type: String },
  document: { type: [String] },
  appliedAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("companyApplication", companyApplication);
