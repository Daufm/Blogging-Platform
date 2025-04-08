import express from "express"
import { getUserSavedPosts, savePost ,requestOtp,verifyAndRegister,Login} from "../controllers/user.controller.js"

const router = express.Router()

router.get("/saved", getUserSavedPosts)
router.patch("/save", savePost)
router.post("/sendOtp", requestOtp)
router.post("/verify-otp" ,verifyAndRegister)
router.post("/login", Login)

export default router 