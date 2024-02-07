import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: { type: String, default: "" },
  favorites: { type: Array, default: [] },
  cart: { type: Array, default: [] },
  orders: { type: Array, default: [] },
  work: { type: Array, default: [] }
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;


