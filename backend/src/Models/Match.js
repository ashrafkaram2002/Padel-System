const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const matchSchema = new Schema(
    {
      team1: {
        type: [String],
        required: true,
      },
      team2: {
        type: [String],
        required: true,
      },
      score: {
        type: String,
      },
    },
    { timestamps: true }
  );

const Match = mongoose.model("Match", matchSchema);
module.exports = Match;