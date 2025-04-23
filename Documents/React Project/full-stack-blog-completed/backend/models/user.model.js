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
      required: function () {
        return !this.isGoogleUser; // Password is required only if the user is not a Google user
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBanned:{
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "author", "Admin"],
      default: "user",
    },
    img: {
      type: String,
    },
    bio: {
      type: String,
      default: "", // Optional, avoids `undefined`
    },
    sex: {
      type: String,
      enum: ["male", "female", "other"], // Added "other" as a valid option
      default: "other", // Default value is now valid
    },
    savedPosts: {
      type: [String],
      default: [],
    },
    isGoogleUser: {
      type: Boolean,
      default: false, // Tracks if the user is created via Google login
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);