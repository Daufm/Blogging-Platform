import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // or 'Author' if you have a separate model
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  totalReceived: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Optional: auto-update timestamp on change
walletSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Wallet = mongoose.model('Wallet', walletSchema);
export default Wallet;
