import axios from 'axios';
import Donation from '../models/Donation.js';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const { CHAPA_SECRET_KEY, CLIENT_URL } = process.env;

export const initiateDonation = async (req, res) => {
  let { amount, name, email, message } = req.body;

  // Sanitize input with fallbacks
  amount = amount || 50; // Default amount
  name = name?.trim() || 'Test User';
  email = email?.trim() || 'test@example.com';
  message = message?.trim() || '';

  console.log({ amount, name, email, message });

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
    await Donation.create({ name, email, amount, tx_ref, message, status: 'pending' });

    res.status(200).json({ checkout_url: chapaRes.data.data.checkout_url });
  } catch (err) {
    console.error('Chapa Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to initiate donation' });
  }
};




export const chapaWebhook = async (req, res) => {
    const { tx_ref, status } = req.body;
  
    // Log the incoming webhook payload
    console.log('Webhook received:', req.body);
  
    // Verify required fields
    if (!tx_ref || !status) {
      return res.status(400).send('Invalid webhook payload');
    }
  
    try {
      // Verify Chapa signature (optional, if Chapa provides a signature header)
      const chapaSignature = req.headers['chapa-signature'];
      if (!chapaSignature || chapaSignature !== CHAPA_SECRET_KEY) {
        return res.status(403).send('Invalid Chapa signature');
      }
  
      // Find the donation by tx_ref
      const donation = await Donation.findOne({ tx_ref });
      if (!donation) {
        return res.status(404).send('Donation not found');
      }
  
      // Update the donation status
      donation.status = status === 'success' ? 'successful' : 'failed';
      await donation.save();
  
      // Respond to Chapa
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
      if (!donation) {
        return res.status(404).json({ error: 'Donation not found' });
      }
  
      res.status(200).json(donation);
    } catch (error) {
      console.error('Error fetching donation details:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };