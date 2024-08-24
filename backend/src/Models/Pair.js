const Schema = mongoose.Schema;

const pairSchema = new Schema(
  {
    player1: {
      type: String,
      required: true,
    },
    player2: {
      type: String,
      required: true,
    },
    points: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Pair = mongoose.model("Pair", pairSchema);
module.exports = Pair;