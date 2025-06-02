import express from 'express';
import crypto from 'crypto';
import Wallet from '../models/wallet.js';
import Donation from '../models/Donation.js';

const router = express.Router();

const CHAPA_SECRET = process.env.CHAPA_SECRET_HASH; // Set this in your .env

// Middleware to parse raw body for signature verification
router.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));

router.post('/webhook', async (req, res) => {
  const signature =
    req.headers['x-chapa-signature'] || req.headers['chapa-signature'];
  const hash = crypto
    .createHmac('sha256', CHAPA_SECRET)
    .update(req.rawBody)
    .digest('hex');

  if (hash !== signature) {
    console.warn('Invalid webhook signature');
    return res.status(403).send('Forbidden');
  }

  const event = req.body;

  try {
    if (event.event === 'charge.success' && event.status === 'success') {
      // Find the donation by tx_ref
      const donation = await Donation.findOne({ tx_ref: event.tx_ref });
      if (!donation) {
        console.warn('Donation not found for tx_ref:', event.tx_ref);
        return res.status(404).send('Donation not found');
      }

      // Mark donation as successful
      donation.status = 'successful';
      await donation.save();

      // Update author's wallet
      if (donation.authorId) {
        // Commission logic (e.g., 10%)
        const commissionRate = 0.10;
        const netAmount = donation.amount * (1 - commissionRate);

        let wallet = await Wallet.findOne({ user: donation.authorId });
        if (!wallet) {
          wallet = new Wallet({ user: donation.authorId, balance: 0 });
        }
        wallet.balance += netAmount;
        await wallet.save();
        console.log('✅ Wallet updated for author:', donation.authorId);
      }
      console.log('✅ Donation received and wallet updated:', event.tx_ref);
    }

    if (event.event === 'payout.success' && event.status === 'success') {
      // Handle successful payout
      console.log('✅ Payout completed:', event.reference);
      // Example: await updatePayoutStatus(event.reference, 'success');
    }

    return res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error handling webhook:', error);
    return res.status(500).send('Internal Server Error');
  }
});

export default router;
