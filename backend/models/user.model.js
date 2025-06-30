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
        return !this.isGoogleUser;
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "author", "admin"],
      default: "user",
    },
    img: {
      type: String,
    },
    bio: {
      type: String,
      default: "",
    },
    sex: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    savedPosts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
],
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
    CBEAccount: {
      type: String,
      default: "",
    },
    PhoneNumber: {
      type: String,
      default: "",
    },
    byMecoffe: {
      type: String,
      default: "",
    },
    //for login attempts
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
