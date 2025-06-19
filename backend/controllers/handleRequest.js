import AuthorRequest from "../models/AuthorRequest.js";
import User from "../models/user.model.js";
import Wallet from '../models/wallet.js';
import WithdrawFund from "../models/withdrawFund.js";

export const requestAuthor = async (req, res)=>{
    const { userId } = req.body;
    

    if (!userId) {
        console.log("User ID from localStorage:", userId);
        return res.status(400).json({ message: 'User ID missing in request.' });
      }


    const existing = await AuthorRequest.findOne({ userId, status: 'pending' });
    if (existing) {
      return res.status(400).json({ message: 'You already have a pending request.' });
    }
  
    const request = new AuthorRequest({ userId });
    await request.save();
  
    res.status(200).json({ message: 'Author role request submitted.' });

}

export const getAuthorRequests = async (req, res)=>{

    const userId = req.user._id; 
    try {
        const requests = await AuthorRequest.find({ status: 'pending' })
        .populate('userId', 'username  email isBanned createdAt');

        res.status(200).json({requests});
      } catch (error) {
        console.error('Error fetching author requests:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
}




export const approveAuthor = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  try {
    // Update user role to 'author'
    const user = await User.findOneAndUpdate(
      { email },
      { role: 'author' },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the author request
    await AuthorRequest.findByIdAndDelete(id); 

    // Check if wallet already exists
    const existingWallet = await Wallet.findOne({ user: user._id });
    if (!existingWallet) {
      await Wallet.create({ user: user._id, balance: 0 });
    }

    console.log('User promoted to author and wallet created:', user._id);
    return res.status(200).json({ message: 'Author role approved and wallet created.' });

  } catch (error) {
    console.error('Error approving author role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




export const rejectAuthor = async (req ,res)=>{
    const { id } = req.params;
    try {
        await AuthorRequest.findByIdAndDelete(id);
        res.status(200).json({ message: 'Author role rejected.' });

    }
    catch (error) {
      console.error('Error rejecting author role:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}

export const fundRequests = async (req, res) => {
  try {
    const requests = await WithdrawFund.find({ status: 'pending' })
      .populate('authorId', 'username CBEAccount PhoneNumber  createdAt')
      .sort({ createdAt: -1 })
      .select('amount authorId createdAt'); 

    res.status(200).json({ requests });
  } catch (error) {
    console.error('Error fetching fund requests:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};