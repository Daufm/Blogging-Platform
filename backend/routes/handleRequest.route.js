import express from 'express';
import { authenticate } from "../middlewares/auth.js";
import { requestAuthor,fundRequests ,
    getAuthorRequests,approveAuthor,rejectAuthor ,
    approveFund,rejectFund,

} from '../controllers/handleRequest.js';

const router = express.Router();

router.post('/request-author', requestAuthor);
router.get('/get/author-requests', authenticate, getAuthorRequests);
router.patch('/approve/:id' , authenticate, approveAuthor);
router.patch('/reject/:id' , authenticate, rejectAuthor);
router.get('/get/fund-requests' , authenticate, fundRequests);
router.patch('/approve-fund/:id' , authenticate, approveFund);
router.patch('/reject-fund/:id' , authenticate, rejectFund);


export default router;