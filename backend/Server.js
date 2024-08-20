const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const stripe = require("stripe")(
  "sk_test_51O9lZ0IQTS4vUIMWJeAJ5Ds71jNbeQFj6v8mO7leS2cDIJuLy1fwNzoiXPKZV5KdoMpfzocfJ6hBusxPIjbGeveF00RTnmVYCX"
);
const http = require("http");

mongoose.set("strictQuery", false);
require("dotenv").config();

//Admin Controller

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
  
  // #Routing to userController here
  app.use(express.json());


