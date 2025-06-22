import express from 'express';
import { initiateDonation,withdarFunds ,chapaWebhook, DonationDetails,getWalletDonations, } from '../controllers/PaymentController.js';

const Router = express.Router();


Router.post('/donate' , initiateDonation);
Router.post('/chapa/webhook', chapaWebhook);
Router.get('/donations/:tx_ref' , DonationDetails)
Router.get('/donations/wallet/:id', getWalletDonations);
Router.post('/withdraw/:id' , withdarFunds);


export default Router;