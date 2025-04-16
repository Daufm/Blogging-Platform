import express from "express"
import {authenticate} from '../middlewares/auth.js';
import { getUserSavedPosts,getAuthor,updateAuthor,updateProfile,getUserProfile, savePost ,requestOtp,verifyAndRegister,Login} from "../controllers/user.controller.js"

const router = express.Router()

router.get("/saved", getUserSavedPosts)
router.patch("/save", savePost)
router.post("/sendOtp", requestOtp)
router.post("/verify-otp" ,verifyAndRegister)
router.post("/login", Login)
router.get("/authors/:username", getAuthor);
router.patch("/authors/update", updateAuthor);
router.get("/profile/:username", getUserProfile);
router.patch('/profile1/update', authenticate, updateProfile);
export default router 