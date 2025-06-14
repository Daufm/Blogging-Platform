import express from 'express';
import { initiateDonation ,chapaWebhook, DonationDetails,getWalletDonations, } from '../controllers/PaymentController.js';

const Router = express.Router();


Router.post('/donate' , initiateDonation);
Router.post('/chapa/webhook', chapaWebhook);
Router.get('/donations/:tx_ref' , DonationDetails)
Router.get('/donations/wallet/:id', getWalletDonations);


export default Router;