const Schema = mongoose.Schema;

const pairSchema = new Schema(
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

const Pair = mongoose.model("Pair", pairSchema);
module.exports = Pair;