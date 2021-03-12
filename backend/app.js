const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes= require("./routes/posts");
const userRoutes= require("./routes/user");
const storiesRoutes = require("./routes/stories");
const path= require("path");
const app = express();
var cors = require('cors')

mongoose
  .connect(
    "mongodb+srv://May:8075492@cluster0.u5qtz.mongodb.net/Blog?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join("backend/images")));
app.use("/stories",express.static(path.join("backend/stories")));
// Configuring CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, userid, expirationdate, authorization, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stories", storiesRoutes);

module.exports = app;
