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
    role:{
      type: String,
      enum: ["Subscriber", "Admin"],
      default: "Subscriber",
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