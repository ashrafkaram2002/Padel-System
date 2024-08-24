const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");

const http = require("http");
const express = require("express");

mongoose.set("strictQuery", false);
require("dotenv").config();



//Admin Controller
const {
  login,
    logout,
    updateUserInfoInCookie,
    requireAdminAuth,
    createToken,
    addAdmin,
    removePlayer,
    removeAdmin,
    addPlayer,
    makePairs,
    requireAuth,
} = require("./src/Controllers/adminController.js");
//Player Controller

//Pairs Controller

const port = process.env.PORT || "8000";
const app = express();
const server = app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

const adminstrator = require("./src/Models/Admin.js");
const player = require("./src/Models/Player.js");
const pair = require("./src/Models/Pair.js");

const MongoURI = process.env.MONGO_URI;

mongoose
  .connect(MongoURI)
  .then(() => {
    console.log("MongoDB is now connected!");
    // Starting server
  })
  .catch((err) => console.log(err));

app.get("/home", (req, res) => {
    res.status(200).send("You have everything installed!");
  });
  
  
  app.use(express.json());

  app.post("/login", login);
app.get("/logout", logout);
app.post("/addAdmin", requireAuth , addAdmin);
app.delete("/removePlayer", requireAuth , removePlayer);
app.post("/addPlayer", requireAuth , addPlayer);
app.post("/makePairs", requireAuth ,makePairs);
app.delete("/removeAdmin", requireAuth ,removeAdmin);

