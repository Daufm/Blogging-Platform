import express from 'express';
import { initiateDonation ,chapaWebhook, DonationDetails} from '../controllers/PaymentController.js';

const Router = express.Router();


Router.post('/donate' , initiateDonation);
Router.post('/chapa/webhook', chapaWebhook);
Router.get('/donations/:tx_ref' , DonationDetails)


export default Router;