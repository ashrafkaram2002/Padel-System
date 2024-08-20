const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "this username is taken, please enter another username"],
    },
    password: {
      type: String,
      required: true,
    },
    email: {
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

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
