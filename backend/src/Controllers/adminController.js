const adminModel = require("../Models/Admin.js");
const playerModel = require("../Models/Player.js");
const matchModel = require("../Models/Match.js");
const drawModel = require("../Models/Draw.js");

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

// const login = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Find admin by username
//     const admin = await adminModel.findOne({ username });
    
//     // Check if admin exists
//     if (!admin) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Compare the provided password with the stored hashed password
//     const auth = await bcrypt.compare(password, admin.password);

//     if (auth) {
//       // Create JWT token
//       const token = createToken(admin._id);
      
//       // Set the JWT token in a cookie (correctly multiplying maxAge)
//       res.cookie('jwt', token, {
//         httpOnly: true,   // Prevents client-side access to the cookie
//         maxAge: maxAge * 1000, // Sets cookie expiration time to 1 day in milliseconds
//         secure: false,    // Set to true in production when using HTTPS
//         sameSite: 'None',  // Adjust SameSite policy to prevent CSRF
//       });

//       // Return success response
//       return res.status(200).json({ message: "Admin logged in", user: admin });
//     } else {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     return res.status(500).json({ message: "Server Error" });
//   }
// };

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
  

    try {
      let password = req.body.password;
      const {username} = req.body;
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
      points,
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
        points,
        wins: "0",
        loses: "0", 
      });
  
      console.log("Player Created!");
      res.status(200).send(newPlayer);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  };

  

  // const removePlayer = async (req, res) => {
  //   try {
  //     const name = req.body.name;
  //     const removedPlayer = await playerModel.findOneAndDelete({
  //       name: name,
  //     });
  
  //     if (!removedPlayer) {
  //       return res.status(404).json({ message: "Player not found" });
  //     }
  //     return res.status(200).json({ message: "Player removed successfully" });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(500).json({ message: "Internal server error" });
  //   }
  // };

  const removePlayer = async (req, res) => {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: "Player ID not found" });
      }
      const removedPlayer = await playerModel.findByIdAndDelete(id);
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

  const teamMatching = async (req, res) => {
    const playerNames = req.body.playerNames;
  
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
      const leftPlayers = players.filter((player) => player.position === "left");
      const rightPlayers = players.filter((player) => player.position === "right");
  
      if (leftPlayers.length !== rightPlayers.length) {
        throw new Error("Number of left and right position players must be equal.");
      }
  
      // Sort players by points for balanced pairing
      leftPlayers.sort((a, b) => b.points - a.points);
      rightPlayers.sort((a, b) => a.points - b.points);
  
      const teams = [];
  
      // Create pairs
      for (let i = 0; i < leftPlayers.length; i++) {
        const player1 = leftPlayers[i];
        const player2 = rightPlayers[i];
  
        // Add the pair as an array of player names
        teams.push([player1.name, player2.name]);
      }
  
      return res.status(200).json({ teams });
  
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };

  const teamMatchingRandomized = async (req, res) => {
    const playerNames = req.body.playerNames;
  
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
      const leftPlayers = players.filter((player) => player.position === "left");
      const rightPlayers = players.filter((player) => player.position === "right");
  
      if (leftPlayers.length !== rightPlayers.length) {
        throw new Error("Number of left and right position players must be equal.");
      }
  
      // Randomize the order of the players
      const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
      const shuffledLeftPlayers = shuffleArray(leftPlayers);
      const shuffledRightPlayers = shuffleArray(rightPlayers);
  
      const teams = [];
  
      // Create randomized pairs
      for (let i = 0; i < shuffledLeftPlayers.length; i++) {
        const player1 = shuffledLeftPlayers[i];
        const player2 = shuffledRightPlayers[i];
  
        // Add the pair as an array of player names
        teams.push([player1.name, player2.name]);
      }
  
      return res.status(200).json({ teams });
  
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  
  

  const requireAuth = async (req, res, next) => {
    const token = req.cookies.jwt;
    console.log('Token:', token); // Check if token is retrieved
  
    if (token) {
      jwt.verify(token, "secret-unkown", (err, decodedToken) => {
        if (err) {
          console.log('JWT Error:', err.message);
          res.redirect("/login");
        } else {
          req.user = decodedToken;
          console.log('Decoded Token:', decodedToken); // Check if token is decoded
          next();
        }
      });
    } else {
      console.log('No token found');
      res.redirect("/login");
    }
  };
  
  


  const UpdateScoreAndPoints = async (req, res) => {
    try {
      const { teams, score } = req.body;
  
      // Extract teams from the input
      const team1 = teams[0];
      const team2 = teams[1];
  
      // Determine the winner and loser based on the score
      const scoreSets = score.split('/').map(set => set.split('-').map(Number));
      let winnerTeam, loserTeam;
  
      const team1SetsWon = scoreSets.filter(([t1, t2]) => t1 > t2).length;
      const team2SetsWon = scoreSets.filter(([t1, t2]) => t2 > t1).length;
  
      if (team1SetsWon > team2SetsWon) {
        winnerTeam = team1;
        loserTeam = team2;
      } else {
        winnerTeam = team2;
        loserTeam = team1;
      }
  
      // Fetch players from the database
      const winningPlayers = await playerModel.find({
        name: { $in: winnerTeam }
      });
  
      const losingPlayers = await playerModel.find({
        name: { $in: loserTeam }
      });
  
      // Convert string points to numbers and calculate the total points for the teams
      const winningTeamPoints = winningPlayers.reduce((sum, player) => sum + Number(player.points), 0);
      const losingTeamPoints = losingPlayers.reduce((sum, player) => sum + Number(player.points), 0);
  
      // Calculate the delta (absolute difference)
      const delta = Math.abs(winningTeamPoints - losingTeamPoints);
  
      // Initialize points to be added or subtracted
      let pointsChange;
  
      // Apply point changes based on delta range
      if (delta <= 100) {
        pointsChange = 20;
      } else if (delta <= 200) {
        pointsChange = winningTeamPoints > losingTeamPoints ? 16 : 24;
      } else if (delta <= 300) {
        pointsChange = winningTeamPoints > losingTeamPoints ? 12 : 28;
      } else if (delta <= 400) {
        pointsChange = winningTeamPoints > losingTeamPoints ? 8 : 32;
      } else {
        pointsChange = winningTeamPoints > losingTeamPoints ? 4 : 36;
      }
  
      // Update points and wins/loses for each player
      for (const player of winningPlayers) {
        player.points = (Number(player.points) + pointsChange).toString();
        player.wins = (Number(player.wins) + 1).toString();
        await player.save();
      }
  
      for (const player of losingPlayers) {
        player.points = (Number(player.points) - pointsChange).toString();
        player.loses = (Number(player.loses) + 1).toString();
        await player.save();
      }
  
      // Create a new Match record
      const newMatch = new matchModel({
        team1: team1,
        team2: team2,
        score: score,
      });
  
      await newMatch.save();
  
      // Fetch the draw
      const drawEntry = await drawModel.findOne();
  
      if (drawEntry) {
        // Find and remove the specific match
        const updatedDraw = drawEntry.draw.filter(
          (match) => 
            !(
              (JSON.stringify(match[0]) === JSON.stringify(team1) && JSON.stringify(match[1]) === JSON.stringify(team2)) ||
              (JSON.stringify(match[0]) === JSON.stringify(team2) && JSON.stringify(match[1]) === JSON.stringify(team1))
            )
        );
  
        // Check if any matches remain, if only one is left, delete the whole draw
        if (updatedDraw.length > 1) {
          drawEntry.draw = updatedDraw;
          await drawEntry.save();
        } else {
          await drawModel.deleteMany({});
        }
      }
  
      return res.status(200).json({
        message: 'Points updated successfully',
        match: newMatch,
        updatedPlayers: {
          winningPlayers,
          losingPlayers,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  
  
  
  
  const previousDraws = []; // To store the previously generated draws

  const makeDraw = async (req, res) => {
      const teams = req.body.teams; // Array of arrays of size 2 with player names
      try {
          // Fetch players based on provided names and calculate team points
          const teamPoints = await Promise.all(
              teams.map(async ([player1Name, player2Name]) => {
                  const player1 = await playerModel.findOne({ name: player1Name });
                  const player2 = await playerModel.findOne({ name: player2Name });
  
                  if (!player1 || !player2) {
                      throw new Error(`Player ${!player1 ? player1Name : player2Name} not found.`);
                  }
  
                  const totalPoints = parseInt(player1.points) + parseInt(player2.points);
                  return {
                      team: [player1Name, player2Name],
                      points: totalPoints,
                  };
              })
          );
  
          // Sort teams by their total points (highest to lowest)
          teamPoints.sort((a, b) => b.points - a.points);
  
          // Schedule matches: highest vs lowest, second highest vs second lowest, etc.
          const matches = [];
          while (teamPoints.length > 1) {
              const highestTeam = teamPoints.shift();
              const lowestTeam = teamPoints.pop();
              matches.push([highestTeam.team, lowestTeam.team]);
          }
  
          // Save this draw to previousDraws
          previousDraws.push(matches);
  
          return res.status(200).json(matches);
      } catch (error) {
          return res.status(400).json({ error: error.message });
      }
  };
  

  const makeDraw2 = async (req, res) => {
    const { teams } = req.body;
  
    try {
      // Ensure teams are in pairs and count is even
      if (teams.length % 2 !== 0) {
        throw new Error("Number of teams must be even.");
      }
  
      // Helper function to generate all unique combinations of pairs from the given teams
      const generateUniquePairs = (teams) => {
        const results = [];
        const used = new Set();
  
        const generatePairs = (remainingTeams, currentPairs = []) => {
          if (remainingTeams.length === 0) {
            results.push([...currentPairs]);
            return;
          }
  
          for (let i = 0; i < remainingTeams.length; i++) {
            for (let j = i + 1; j < remainingTeams.length; j++) {
              const pair = [remainingTeams[i], remainingTeams[j]];
              const sortedPair = pair.sort().toString();
  
              if (!used.has(sortedPair)) {
                used.add(sortedPair);
                generatePairs(
                  remainingTeams.filter((_, index) => index !== i && index !== j),
                  [...currentPairs, pair]
                );
                used.delete(sortedPair);
              }
            }
          }
        };
  
        generatePairs(teams);
        return results;
      };
  
      const allCombinations = generateUniquePairs(teams);
  
      if (allCombinations.length === 0) {
        throw new Error("No unique combinations possible.");
      }
  
      // Function to normalize draw order by sorting matches
      const normalizeDraw = (draw) => {
        return draw.map(match => match.sort((a, b) => a.toString().localeCompare(b.toString())))
                    .sort((a, b) => a.toString().localeCompare(b.toString()));
      };
  
      // Store previous combinations to avoid repeats
      const usedCombinations = req.app.locals.usedCombinations || [];
      req.app.locals.usedCombinations = usedCombinations;
  
      let selectedCombination;
      
      // Convert all draws to normalized form
      const normalizedCombinations = allCombinations.map(combo => normalizeDraw(combo));
      const usedNormalizedCombinations = usedCombinations.map(combo => normalizeDraw(combo));
  
      // Find a new combination not used before
      for (const combo of normalizedCombinations) {
        if (!usedNormalizedCombinations.some(prevCombo => prevCombo.toString() === combo.toString())) {
          selectedCombination = combo;
          usedCombinations.push(combo);
          break;
        }
      }
  
      if (!selectedCombination) {
        // If all combinations have been used, reset and start over
        req.app.locals.usedCombinations = [];
        selectedCombination = allCombinations[0];
      }
  
      return res.status(200).json(selectedCombination);
  
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };
  

  const makeDraw3 = async (req, res) => {
    const { teams, numCombinations } = req.body;

    try {
        // Ensure teams are in pairs and count is even
        if (teams.length % 2 !== 0) {
            throw new Error("Number of teams must be even.");
        }

        const totalTeams = teams.length;
        const maxCombinations = totalTeams - 1; // n-1 combinations for round-robin

        // Check if the number of requested combinations is valid
        if (numCombinations > maxCombinations) {
            throw new Error(`Requested number of combinations exceeds the possible unique combinations for this draw (${maxCombinations}).`);
        }

        const generateRoundRobinCombinations = (teams) => {
            const results = [];
            const n = teams.length;

            // First combination is the user-input order
            results.push([...teams]);

            // Generate n-1 combinations using round-robin rotation
            for (let round = 1; round < n; round++) {
                const newRound = [teams[0]]; // Keep the first team in place

                // Rotate all other teams
                newRound.push(...teams.slice(1).map((_, i) => teams[(i + round) % (n - 1) + 1]));
                results.push(newRound);
            }

            return results;
        };

        // Split each round into pairs
        const splitIntoPairs = (combination) => {
            const pairs = [];
            for (let i = 0; i < combination.length; i += 2) {
                pairs.push([combination[i], combination[i + 1]]);
            }
            return pairs;
        };

        const allCombinations = generateRoundRobinCombinations(teams).slice(0, numCombinations);

        // Flatten all combinations into a single array of matches
        const flattenedMatches = allCombinations.flatMap(splitIntoPairs);

        return res.status(200).json(flattenedMatches);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};





  
  
  
  
  
  
  
  
  // const makeDraw3 = async (req, res) => {
  //   const { teams } = req.body;
  
  //   try {
  //     // Ensure the number of teams is even and more than 2
  //     if (teams.length % 2 !== 0) {
  //       throw new Error("Number of teams must be even.");
  //     }
  
  //     // Helper function to generate 2 matches per team
  //     const generateMatches = (teams) => {
  //       const matches = [];
  //       const n = teams.length;
  
  //       // First round: Pair teams sequentially
  //       for (let i = 0; i < n; i += 2) {
  //         matches.push([teams[i], teams[i + 1]]);
  //       }
  
  //       // Second round: Rotate teams to create new matches
  //       for (let i = 0; i < n / 2; i++) {
  //         matches.push([teams[i], teams[i + n / 2]]);
  //       }
  
  //       return matches;
  //     };
  
  //     // Generate matches where each team plays exactly 2 matches
  //     const generatedMatches = generateMatches(teams);
  
  //     return res.status(200).json({generatedMatches });
  //   } catch (error) {
  //     return res.status(400).json({ error: error.message });
  //   }
  // };
  



  const viewPlayers = async (req, res) => {
  try {
    // Fetch all players from the database
    const players = await playerModel.find();

    // If there are no players, return a 404 error
    if (!players.length) {
      return res.status(404).json({ message: "No players found." });
    }

    // Sort players by points (converted to numbers) in descending order
    const sortedPlayers = players.sort((a, b) => Number(b.points) - Number(a.points));

    // Return the sorted players in the response
    res.status(200).json(sortedPlayers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

  
  
  const viewAdmins = async (req, res) => {
    try {
      const admins = await adminModel.find(); // Replace `adminModel` with the actual name of your admin model
      res.status(200).json(admins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }; 
  
  const viewMatches = async (req, res) => {
    try {
      // Fetch all matches from the database
      const matches = await matchModel.find();
  
      // If there are no players, return a 404 error
      if (!matches.length) {
        return res.status(404).json({ message: "No matches found." });
      }
  
      // Return the matches in the response
      res.status(200).json(matches);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const confirmDraw = async (req, res) => {
    try {
      const { teams } = req.body;
  
      if (!teams || teams.length === 0) {
        return res.status(400).json({ error: "Teams data is required." });
      }
      // Generate draw array structure
      const draw = [];
      while (teams.length > 1) {
        const team1 = teams.shift();
        const team2 = teams.pop();
        draw.push([team1, team2]);
      }
  
      // Delete any existing draws
      await drawModel.deleteMany({});
  
      // Create a new draw with empty strings for timings, day, and location
      const newDraw = await drawModel.create({ draw, timings: [], day: "", locations: [] });
  
      // Return the newly created draw
      return res.status(200).json(newDraw);
    } catch (error) {
      console.error(error.stack);
      return res.status(500).json({ error: error.message });
    }
  };
  
  
  const putTimings = async (req, res) => {
    try {
      const { timings, day, locations } = req.body;
  
      if (!timings || !Array.isArray(timings) || timings.length === 0) {
        return res.status(400).json({ error: "Timings array is required." });
      }
  
      // if (!day || typeof day !== 'string') {
      //   return res.status(400).json({ error: "A valid day string is required." });
      // }

      // Validate day (now it expects an array of strings)
      if (!day || !Array.isArray(day) || day.some(d => typeof d !== 'string')) {
         return res.status(400).json({ error: "An array of valid day strings is required." });
      }
  
      if (!locations || !Array.isArray(locations) || locations.length === 0) {
        return res.status(400).json({ error: "Locations array is required." });
      }
  
      // Retrieve the existing draw
      const existingDraw = await drawModel.findOne();
      if (!existingDraw) {
        return res.status(404).json({ error: "No draw found." });
      }
  
      // Update the draw with timings, day, and locations
      existingDraw.timings = timings;
      existingDraw.day = day;
      existingDraw.locations = locations;
  
      // Save the updated draw
      await existingDraw.save();
  
      // Return the updated draw
      return res.status(200).json(existingDraw);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  

  const viewDraw = async (req, res) => {
    try {
      // Fetch all draws from the database
      const draws = await drawModel.find({});
  
      // Check if there are any draws
      if (draws.length === 0) {
        return res.status(404).json({ message: 'No draws found.' });
      }
  
      return res.status(200).json(draws);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  const deleteAllMatches = async (req, res) => {
    try {
      // Delete all documents in the Match collection
      await matchModel.deleteMany({});
  
      // Return a success message
      return res.status(200).json({ message: "All matches have been deleted." });
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
    teamMatching,
    teamMatchingRandomized,
    requireAuth,
    UpdateScoreAndPoints,
    makeDraw,
    makeDraw2,
    viewPlayers,
    viewAdmins,
    viewMatches,
    confirmDraw,
    viewDraw,
    putTimings,
    deleteAllMatches,
    makeDraw3,
}