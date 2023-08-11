const express = require("express");
const app = express();
const morgan = require("morgan");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const connection = require("./src/connection/connection");
const routes = require("./src/routes/index");

dotenv.config();

const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_NAME = process.env.DATABASE_NAME;
connection(DATABASE_URL,DATABASE_NAME);

// enable CORS - Cross Origin Resource Sharing
app.use(cors("*"));
app.use(morgan("tiny"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({ message: "Success!" });
});

app.use("/", routes);

app.listen(PORT, function () {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
