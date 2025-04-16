import { Schema } from "mongoose";
import mongoose from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "author", "Admin"],
      default: "User",
    },
    img: {
      type: String,
    },
    bio: {
      type: String,
      default: "", // optional, but avoids `undefined`
    },
    sex:{
    type: String,
    enum: ["male", "female"],
    default: ""
    },
    savedPosts: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
