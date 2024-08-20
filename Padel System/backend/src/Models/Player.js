const Schema = mongoose.Schema;

const playerSchema = new Schema(
  {
    points: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Player = mongoose.model("Player", playerSchema);
module.exports = Player;
