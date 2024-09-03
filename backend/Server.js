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
    teamMatching,
    teamMatchingRandomized,
    UpdateScoreAndPoints,
    makeDraw,
    requireAuth,
    viewPlayers,
    viewAdmins,
    makeDraw2,
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

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);

app.get("/logout", logout);
app.get("/viewPlayers" ,viewPlayers);
app.get("/viewAdmins", requireAuth ,viewAdmins);

app.post("/login", login);
app.post("/addAdmin" , requireAuth ,addAdmin);
app.post("/addPlayer" , requireAuth ,addPlayer);
app.post("/teamMatching" , requireAuth ,teamMatching);
app.post("/teamMatchingRandomized" , requireAuth ,teamMatchingRandomized);
app.post("/UpdateScoreAndPoints" , requireAuth ,UpdateScoreAndPoints);
app.post("/makeDraw" , requireAuth ,makeDraw);
app.post("/makeDraw2" , requireAuth ,makeDraw2);

app.delete("/removePlayer" , requireAuth ,removePlayer);
app.delete("/removeAdmin" ,requireAuth,removeAdmin);

