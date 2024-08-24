const adminModel = require("../Models/Admin.js");
const playerModel = require("../Models/Player.js");
const pairModel = require("../Models/Pair.js");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 6 * 60;
const bcrypt = require("bcrypt");

const createToken = (id) => {
    return jwt.sign({ id }, "secret-unkown", {
      expiresIn: maxAge,
    });
  };

const login = async (req, res) => {
    const { username, password } = req.body; 
    try {
        const admin = await adminModel.findOne({ username });
        const auth = await bcrypt.compare(password, admin.password);
      if (auth) {
        const token = createToken(admin._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge } * 1000);
        return res.status(200).json({ message: "Admin", user: admin });
      } else {
        return res.status(401).json({ message: "Invalid credentials" });
      }
    }
    catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Server Error" });
      }
}

const requireAdminAuth = (req, res, next) => {
    const token = req.cookies.jwt;
  
    if (token) {
      jwt.verify(token, "secret-unkown", async (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect("/login");
        } else {
          const admin = await adminModel.findById(decodedToken.id);
          if (!admin) {
            res.redirect("/login");
          } else {
            req.user = decodedToken;
            next();
          }
        }
      });
    } else {
      res.redirect("/login");
    }
  };

  const updateUserInfoInCookie = (req, res, user) => {
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
  };

  const logout = async (req, res) => {
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true });
    res.status(200).json({ message: "Logout successful" });
  };

  const addAdmin = async (req, res) => {
    const { username } = req.body;
  
    try {
      let password = req.body.password;
      const { username, email, name } = req.body;
      const salt = await bcrypt.genSalt();
      const newPassword = await bcrypt.hash(password, salt);
      password = newPassword;
  
      console.log("creating admin " + newPassword);
  
      const existingAdmin = await adminModel.findOne({ username });
      if (existingAdmin) {
        return res
          .status(409)
          .send({ message: "Admin with this username already exists." });
      }
  
      const newAdmin = await adminModel.create({
        username,
        password,
        name,
        email,
      });
      console.log("Admin Created!");
      res.status(200).send(newAdmin);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  const addPlayer = async (req, res) => {
    const {
      name,
      position, 
    } = req.body;
    try {
      const existingPlayer = await playerModel.findOne({ name });
      if (existingPlayer) {
        return res
          .status(409)
          .send({ message: "Player with this name already exists." });
      }
  
      const newPlayer = await playerModel.create({
        name,
        position,
        points: 0,
      });
  
      console.log("Player Created!");
      res.status(200).send(newPlayer);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  const removePlayer = async (req, res) => {
    try {
      const username = req.query.username;
      const removedPlayer = await playerModel.findOneAndDelete({
        username: username,
      });
  
      if (!removedPlayer) {
        return res.status(404).json({ message: "Player not found" });
      }
      return res.status(200).json({ message: "Player removed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const removeAdmin = async (req, res) => {
    try {
      const username = req.query.username;
      const removedAdmin = await adminModel.findOneAndDelete({
        username: username,
      });
  
      if (!removedAdmin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      return res.status(200).json({ message: "Admin removed successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  const makePairs = async (req,res) => {
    const playerNames = req.query.playerNames;
    try {
      if (playerNames.length % 2 !== 0) {
        throw new Error("Number of players must be even.");
      }
  
      // Fetch players based on the provided names
      const players = await playerModel.find({ name: { $in: playerNames } });
  
      if (players.length !== playerNames.length) {
        throw new Error("Some players not found.");
      }
  
      // Separate players by position
      const leftPlayers = players.filter(player => player.position === 'left');
      const rightPlayers = players.filter(player => player.position === 'right');
  
      if (leftPlayers.length !== rightPlayers.length) {
        throw new Error("Number of left and right position players must be equal.");
      }
  
      // Sort players by points for balanced pairing
      leftPlayers.sort((a, b) => b.points - a.points);
      rightPlayers.sort((a, b) => a.points - b.points);
  
      const pairs = [];
  
      // Create pairs
      for (let i = 0; i < leftPlayers.length; i++) {
        const player1 = leftPlayers[i];
        const player2 = rightPlayers[i];
  
        // Check if the pair already exists
        const existingPair = await Pair.findOne({
          $or: [
            { player1: player1.name, player2: player2.name },
            { player1: player2.name, player2: player1.name },
          ],
        });
  
        if (existingPair) {
          return `Pair between ${player1.name} and ${player2.name} already exists.`;
        }
  
        // Create and save the new pair
        const newPair = new pairModel({
          player1: player1.name,
          player2: player2.name,
          points: 0,
        });
  
        await newPair.save();
        pairs.push(newPair);
      }
  
      return pairs;
  
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
  
    if (token) {
      jwt.verify(token, "secret-unkown", (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect("/login");
        } else {
          // Store the user information in the request object
          req.user = decodedToken;
          next();
        }
      });
    } else {
      res.redirect("/login");
    }
  };
  

  module.exports = {
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
}