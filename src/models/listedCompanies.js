const mongoose = require("mongoose");

const listedcompanys = new mongoose.Schema({
  crNumber: { type: String },
  crName: { type: String },
  companyName: { type: String },
  listApplicationId: { type: String },
});
module.exports = mongoose.model("listedcompanys", listedcompanys);