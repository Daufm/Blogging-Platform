import User from "../models/user.model.js";
import 'dotenv/config';
import TempOTP from "../models/TempOTP.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import 'dotenv/config';


// Request OTP Controller
export const requestOtp = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("Received email:", email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    console.log("Generated OTP:", otp);

    await TempOTP.findOneAndUpdate(
      { email },
      { email, otp, otpExpires },
      { upsert: true, new: true }
    );
    console.log("OTP saved to TempOTP collection");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      }
    });

    await transporter.sendMail({
      from: `"Blog Sphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    });
    console.log("OTP email sent");

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in requestOtp:", error);
    res.status(500).json({ message: "Error sending OTP", error });
  }
};


// Verify OTP and register user
export const verifyAndRegister = async (req, res) => {
  const { username, email, password ,otp,role} = req.body;
  
  try {
    // Find the temporary OTP entry
    const tempOtp = await TempOTP.findOne({ email });
    
    // Check if OTP exists and is valid
    if (!tempOtp) {
      return res.status(404).json({ message: "No OTP request found. Please request an OTP first." });
    }
    
    if (tempOtp.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }
    
    if (tempOtp.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
console.log("i pass here");
    // OTP is valid, now create the user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      savedPosts: [],
      role: 'Subscriber',
      isVerified: true // User is pre-verified since OTP is confirmed
    });
    
    await user.save();
    
    // Remove the temporary OTP entry
    await TempOTP.findOneAndDelete({ email });
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error); // Log the error details
    res.status(500).json({ message: "Error registering user", error });
  }
};




// This controller handles user login
export const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Sanitize and validate input
    await body("email").isEmail().normalizeEmail().run(req);
    await body("password").notEmpty().trim().escape().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create a JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in Login:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};


export const getUserSavedPosts = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  res.status(200).json(user.savedPosts);
};

export const savePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ clerkUserId });

  const isSaved = user.savedPosts.some((p) => p === postId);

  if (!isSaved) {
    await User.findByIdAndUpdate(user._id, {
      $push: { savedPosts: postId },
    });
  } else {
    await User.findByIdAndUpdate(user._id, {
      $pull: { savedPosts: postId },
    });
  }

  res.status(200).json(isSaved ? "Post unsaved" : "Post saved");
};
