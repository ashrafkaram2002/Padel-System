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
const cors = require('cors');



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
    viewMatches,
    confirmDraw,
    viewDraw,
    putTimings,
    deleteAllMatches,
    makeDraw3,
} = require("./src/Controllers/adminController.js");
//Player Controller

//Pairs Controller

const port = process.env.PORT || "8000";
const app = express();

app.use(cors());
const server = app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

// app.use(cors({
//   origin: "http://localhost:3000",   // Ensure this matches your frontend's URL
//   credentials: true,                 // Allow credentials (cookies)
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed HTTP methods
//   allowedHeaders: ['Content-Type', 'Authorization'],  // Allow necessary headers
// }));
// const server = app.listen(port, () => {
//      console.log(`Listening to requests on http://localhost:${port}`);
//   });


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

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);

app.get("/logout", logout);
app.get("/viewPlayers" ,viewPlayers);
app.get("/viewMatches" ,viewMatches);
app.get("/viewAdmins" ,viewAdmins);
app.get("/viewDraw",viewDraw);

app.post("/login", login);
app.post("/addAdmin" ,addAdmin);
app.post("/addPlayer" ,addPlayer);
app.post("/teamMatching" ,teamMatching);
app.post("/teamMatchingRandomized" ,teamMatchingRandomized);
app.post("/UpdateScoreAndPoints" ,UpdateScoreAndPoints);
app.post("/makeDraw" ,makeDraw);
app.post("/makeDraw2" ,makeDraw2);
app.post("/makeDraw3" ,makeDraw3);
app.post("/confirmDraw" ,confirmDraw);
app.post("/putTimings" ,putTimings);

app.delete("/removePlayer" , removePlayer);
app.delete("/removeAdmin" ,removeAdmin);
app.delete("/deleteAllMatches" ,deleteAllMatches);

