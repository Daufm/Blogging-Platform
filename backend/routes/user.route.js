import express from "express"
import {authenticate} from '../middlewares/auth.js';
import { getUserSavedPosts,getAuthor,GoogleLogin,updateAuthor,
    updateProfile,getUserProfile, savePost ,requestOtp,resetPassword,getPopularAuthors,
    verifyAndRegister,Login,getAllUser,DeleteUser,BanUser, updatePassword,sendResetPasswordLink} from "../controllers/user.controller.js"


const router = express.Router()

router.patch("/:id/ban", authenticate, BanUser)
router.delete("/:id", authenticate, DeleteUser)
router.get("/saved/:id", getUserSavedPosts)
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
router.post("/send-link" , sendResetPasswordLink);
router.post("/reset-password", resetPassword);
router.get("/popular", getPopularAuthors);


export default router 