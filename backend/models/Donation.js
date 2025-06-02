// models/Donation.js
import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  tx_ref: String,
  message: String,
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending',
  },

  // 👇 NEW FIELDS
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Author' if you have a separate model
    required: true
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // optional, only if donor is logged in
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});


const Donation  = mongoose.model('Donation', donationSchema);
export default Donation;
