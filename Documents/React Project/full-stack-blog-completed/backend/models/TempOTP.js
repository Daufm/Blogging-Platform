// models/TempOTP.js
import mongoose from "mongoose";

const tempOTPSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  otp: { 
    type: String, 
    required: true 
  },
  otpExpires: { 
    type: Date, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: 600 // Auto-delete documents after 10 minutes (TTL index)
  }
});

const TempOTP = mongoose.model("TempOTP", tempOTPSchema);
export default TempOTP;