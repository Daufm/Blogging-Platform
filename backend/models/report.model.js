import mongoose from 'mongoose';


const reportSchema = new mongoose.Schema({
  postId: 
  { type: mongoose.Schema.Types.ObjectId,
     ref: 'Post', 
     required: true },
  reportedBy: { 
    type: mongoose.Schema.Types.ObjectId, ref: 'User', 
    required: true },
  reason: { 
    type: String, 
    required: true },
  reportedAt: {
     type: Date, 
     default: Date.now },
});

export default mongoose.model('Report', reportSchema);
