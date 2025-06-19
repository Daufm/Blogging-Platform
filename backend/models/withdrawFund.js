import mongoose from "mongoose";

const WithdrawFundSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

const WithdrawFund = mongoose.model('WithdrawFund', WithdrawFundSchema);
export default WithdrawFund;