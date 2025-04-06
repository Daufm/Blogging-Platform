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
    img: {
      type: String,
    },
    savedPosts: {
      type: [String],
      default: [],
    },
   
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);