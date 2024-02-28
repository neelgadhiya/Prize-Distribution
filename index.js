const express = require("express");
const homeRoute = require("./routes/home");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const port = 3000;
mongoose
  .connect("mongodb://127.0.0.1:27017/prizes")
  .then(() => console.log("Mongodb connected"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//routing
app.use("/", homeRoute);

app.listen(port, () => console.log(`port start at ${port}`));
