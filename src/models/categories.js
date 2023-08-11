const mongoose = require("mongoose");

let categorieSchema = mongoose.Schema(
  {
    categories_name: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("categories", categorieSchema);
