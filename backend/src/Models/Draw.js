const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const drawSchema = new Schema(
    {
      draw: {
        type: [[[String]]],
        required: true,
      },
    },
    { timestamps: true }
  );

const Draw = mongoose.model("Draw", drawSchema);
module.exports = Draw;