const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const connection = async (DATABASE_URL, DATABASE_NAME) => {
  const DATABASE_OPTIONS = {
    dbName: DATABASE_NAME,
  };
  mongoose
    .connect(DATABASE_URL, DATABASE_OPTIONS)
    .then(() => {
      console.log("Connection established");
    })
    .catch((err) => {
      console.log("Error connecting to database : " + err.message);
    });
};
module.exports = connection;
