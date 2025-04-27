import express from "express"
import {authenticate} from '../middlewares/auth.js';
import { getUserSavedPosts,getAuthor,GoogleLogin,updateAuthor,
    updateProfile,getUserProfile, savePost ,requestOtp,
    verifyAndRegister,Login,getAllUser,DeleteUser,BanUser,updatePassword} from "../controllers/user.controller.js"

const router = express.Router()

router.patch("/:id/ban", authenticate, BanUser)
router.delete("/:id", authenticate, DeleteUser)
router.get("/saved", getUserSavedPosts)
router.patch("/save", savePost)
router.post("/sendOtp", requestOtp)
router.post("/verify-otp" ,verifyAndRegister)
router.post("/login", Login)
router.post("/google-login", GoogleLogin)
router.get("/authors/:username", getAuthor);
router.patch("/authors/update", updateAuthor);
router.patch('/update-password', authenticate, updatePassword);
router.get("/profile/:username", getUserProfile);
router.patch('/profile/update', authenticate, updateProfile);
router.get("/all", getAllUser);
export default router 