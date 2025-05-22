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
});

const Donation  = mongoose.model('Donation', donationSchema);
export default Donation;
