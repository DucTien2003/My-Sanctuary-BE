require("dotenv").config();

const cors = require("cors");
const express = require("express");

const declareRoutes = require("./routes/api.js");
// const webRoutes = require('./routes/web.js');

const app = express();
const port = process.env.PORT || 8080;
const hostname = process.env.HOST_NAME || "localhost";

// Config cors
app.use(cors());

// Config request body
app.use(express.json()); // For Json
app.use(express.urlencoded({ extended: true })); // For form data

// Config pre-route
declareRoutes(app);

app.listen(port, hostname, () => {
  console.log(`listening on port ${port}...`);
});
