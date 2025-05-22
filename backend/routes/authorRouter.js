import express from 'express';
import { FollowAuthor} from '../controllers/authoreController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post("/follow",authenticate, FollowAuthor);



export default router;