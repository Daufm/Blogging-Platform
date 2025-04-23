import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import 'dotenv/config';
import TempOTP from "../models/TempOTP.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import 'dotenv/config';
import { OAuth2Client } from "google-auth-library";


//Get all users
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find()
     .select("_id username email role isBanned ")
     .sort({ createdAt: -1 });
     
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
}

// Delete user
export const DeleteUser = async (req, res) => {
 const { id } = req.params;
 try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
 }
 catch(error){
    res.status(500).json({ message: "Failed to delete user" });
  }
 }

// Ban user
export const BanUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isBanned = !user.isBanned; // Toggle ban status
    await user.save();
    
    res.status(200).json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully` });
  } catch (error) {
    console.error('Error banning/unbanning user', error);
    res.status(500).json({ message: 'Failed to ban/unban user' });
  }

}


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
  const { username, email, password ,otp,role,sex,img} = req.body;
  
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
      img,
      bio: "",
      password: hashedPassword,
      savedPosts: [],
      role: role || "User", 
      sex,// Default to "User" if no role is provided
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
      { expiresIn: "1d" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        img: user.img,
      },
    });
  } catch (error) {
    console.error("Error in Login:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};


/// This controller handles user Google Login
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const GoogleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: name,
        email,
        img: picture,
        bio: "",
        password: null,
        savedPosts: [],
        role: "user",
        isVerified: true,
        isGoogleUser: true,
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      jwtToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Google login error:", err);
    res.status(401).json({ message: "Authentication failed" });
  }
};


export const getUserSavedPosts = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json("Not authenticated!");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json("Invalid token");
    }

    const user = await User.findById(decodedToken.id).populate("savedPosts");

    if (!user) {
      return res.status(404).json("User not found");
    }

    res.status(200).json(user.savedPosts);
  } catch (error) {
    console.error("Error getting saved posts:", error);
    res.status(500).json("Something went wrong");
  }
};




export const savePost = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  const postId = req.body.postId;

  if (!decodedToken) {
    return res.status(401).json("Not authenticated!");
  }

  const user = await User.findOne({ _id: decodedToken.id });

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



export const getAuthor = async (req, res) => {
  try {
    const { username } = req.params;

    // Find the author by username
    const author = await User.findOne({ username }).select("username img bio role");
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Find the posts by the author
    const posts = await Post.find({ user: author._id }).select("title desc slug img createdAt category");

    res.status(200).json({ author, posts });
  } catch (error) {
    console.error("Error fetching author data:", error);
    res.status(500).json({ message: "Failed to fetch author data" });
  }
};



export const getUserProfile = async (req, res)=>{
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username }).select("username img bio role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find posts created by the user
    const posts = await Post.find({ user: user._id }).select("title desc slug img createdAt");

    res.status(200).json({ user, posts });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
}

// This controller handles updating the user's profile
export const updateProfile = async (req, res) => {
  try {
    
    console.log("REQ.BODY:", req.body);         // 🔍 log bio and img
    console.log("USER ID:", req.user?.id);       // 🔍 confirm token extraction

    const { bio, img } = req.body;
    const userId = req.user.id;

    const updatedData = {};
    if (bio) updatedData.bio = bio;
    if (img) updatedData.img = img;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};





export const updateAuthor = async (req, res)=>{
  try {
    const { bio } = req.body;
    const img = req.file?.path; // Handle file upload if applicable
    const userId = req.user.id; // Extract user ID from the token

    const updatedData = {};
    if (bio) updatedData.bio = bio;
    if (img) updatedData.img = img;

    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
}