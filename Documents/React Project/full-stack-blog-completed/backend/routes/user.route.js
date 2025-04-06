import express from "express"
import { getUserSavedPosts, savePost ,requestOtp,verifyAndRegister} from "../controllers/user.controller.js"

const router = express.Router()

router.get("/saved", getUserSavedPosts)
router.patch("/save", savePost)
router.post("/sendOtp", requestOtp)
router.post("/verify-otp" ,verifyAndRegister)


export default router 