import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
  bio: { type: String, default: "" },
  gender: { type: String, enum: ["male", "female"] },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  posts : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "POST",
      },
  ],
  bookmarks : [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "POST",
      },
  ],
},{timestamps:true});

export const User = mongoose.model('User', userSchema)
