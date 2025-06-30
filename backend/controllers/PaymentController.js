import axios from 'axios';
import Donation from '../models/Donation.js';
import mongoose from 'mongoose';
import WithdrawFund from '../models/withdrawFund.js';
import dotenv from 'dotenv';
import Wallet from '../models/wallet.js';


dotenv.config(); // Ensure environment variables are loaded

const { CHAPA_SECRET_KEY, CLIENT_URL,EMAIL_USER } = process.env;



export const initiateDonation = async (req, res) => {
  console.log('Initiating donation with body:', req.body);



  let { amount, name , message ,method ,authorId } = req.body;
 

  amount = amount ? parseFloat(amount) : 0;
  name = name?.trim() || 'Test User';
  const email = "fuadmohammed368@gmail.com".trim() || 'test@example.com';
  message = message?.trim() || '';
  authorId= authorId?.trim() || null;
  method = method?.trim() || 'chapa'; // Default to 'chapa' if not provided

  // Validate amount
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount. Please enter a valid donation amount.' });
  }


  try {
    const tx_ref = `tx-${Date.now()}`;

    const callback_url = `${CLIENT_URL}/thank-you?tx_ref=${tx_ref}`;

    const chapaRes = await axios.post(
      'https://api.chapa.co/v1/transaction/initialize',
      {
        amount,
        currency: 'ETB',
        email,
        first_name: name,
        tx_ref,
        callback_url,
        return_url: callback_url,
        customization: {
          title: 'Support Author',
          description: 'Blog donation via Chapa',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
        },
      }
    );

    // Save donation in DB
    await Donation.create({ name, email, amount, tx_ref, message, authorId: new mongoose.Types.ObjectId(authorId), status: 'pending' });


    //update the status of the donation
    const donation = await Donation.findOne({ tx_ref });
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    donation.status = 'pending';
    await donation.save();


    res.status(200).json({ checkout_url: chapaRes.data.data.checkout_url });
  } catch (err) {
    console.error('Chapa Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to initiate donation' });
  }



};







// Webhook handler for Chapa payment notifications
export const chapaWebhook = async (req, res) => {
  const { tx_ref, status } = req.body;

  console.log('Webhook received:', req.body);

  if (!tx_ref || !status) {
    return res.status(400).send('Invalid webhook payload');
  }

  try {
    // Optional: Verify Chapa signature
    const chapaSignature = req.headers['chapa-signature'];
    if (!chapaSignature || chapaSignature !== process.env.CHAPA_WEBHOOK_SECRET) {
      return res.status(403).send('Invalid Chapa signature');
    }

    // Find the donation
    const donation = await Donation.findOne({ tx_ref });
    if (!donation) {
      return res.status(404).send('Donation not found');
    }

    // Update donation status
    donation.status = status === 'success' ? 'successful' : 'failed';
    await donation.save();

    // If successful, update author's wallet
    if (donation.status === 'successful' && donation.author) {
      const commissionRate = 0.10; // 10% commission
      const netAmount = donation.amount * (1 - commissionRate);

      let wallet = await Wallet.findOne({ user: donation.author });
      if (!wallet) {
        // If wallet doesn't exist, create it
        wallet = new Wallet({ user: donation.author, balance: 0 });
      }

      wallet.balance += netAmount;
      await wallet.save();
    }

    res.status(200).json({ message: 'Webhook processed successfully', donation });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).send('Server error');
  }
};

  

  export const DonationDetails = async (req, res) => {
  const { tx_ref } = req.params;

  try {
    const donation = await Donation.findOne({ tx_ref });

    // Check if donation exists
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Update the status of the donation
    if (donation.status !== 'successful') {
      donation.status = 'successful';
      await donation.save();

      // Update author's wallet if not already updated
      if (donation.authorId) {
        const commissionRate = 0.10; // 10% commission
        const netAmount = donation.amount * (1 - commissionRate);

        let wallet = await Wallet.findOne({ authorId: donation.authorId });
        if (!wallet) {
          wallet = new Wallet({ authorId: new mongoose.Types.ObjectId( donation.authorId) , balance: 0 });
        }
        wallet.balance += netAmount;
        await wallet.save();
      }
    }

    res.status(200).json(donation);
  } catch (error) {
    console.error('Error fetching donation details:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const getWalletDonations = async (req,res) =>{
  const{id} = req.params;
  try {
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    // Find donations for the given author ID
    const wallet = await Wallet.findOne({ authorId: id })
      .populate('authorId', 'name  balance ')
      .lean();
    
    // Check if wallet exist
 if (!wallet) {
  const newWallet = new Wallet({ authorId: new mongoose.Types.ObjectId(id), balance: 0 , totalReceived: 0 });
  await newWallet.save();
  return res.status(200).json(newWallet);
}


    res.status(200).json(wallet);
  } catch (error) {
    console.error('Error fetching wallet Balance:', error);
    res.status(500).json({ error: 'Server error' });
  }
}


export const withdarFunds = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body; // Amount to withdraw, if needed

  try {
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid author ID' });
    }

    // Find the wallet for the given author ID
    const wallet = await Wallet.findOne({ authorId: id });

    // Check if wallet exists
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Check if the balance is sufficient for withdrawal
    if (amount <= 100 || amount > wallet.balance) {
      return res.status(400).json({ error: 'Insufficient balance for withdrawal' });
    }

    //store the withdrawal transaction in the database
    const withdrawal = new WithdrawFund({
      authorId: id,
      amount: amount,
      status: 'pending',
    });
    // Deduct the withdrawal amount from the wallet balance
    
    // Update total received
    wallet.totalReceived = wallet.totalReceived + amount; 

    // Save the withdrawal and wallet
    await withdrawal.save(); 
    await wallet.save();

    res.status(200).json({ message: 'Withdrawal successful', wallet });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ error: 'Server error' });
  }
};