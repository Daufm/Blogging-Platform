import express from 'express';
import { authenticate } from "../middlewares/auth.js";
import { requestAuthor ,getAuthorRequests,approveAuthor,rejectAuthor } from '../controllers/handleRequest.js';

const router = express.Router();

router.post('/request-author', requestAuthor);
router.get('/get/author-requests', authenticate, getAuthorRequests);
router.patch('/approve/:id' , authenticate, approveAuthor);
router.patch('/reject/:id' , authenticate, rejectAuthor);



export default router;