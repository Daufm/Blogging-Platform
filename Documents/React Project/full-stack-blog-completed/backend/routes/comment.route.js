import express from "express"
import { addComment, deleteComment, getPostComments } from "../controllers/comment.controller.js"
import { authenticate } from "../middlewares/auth.js"
const router = express.Router()

router.get("/:postId", getPostComments)
router.post("/:postId", authenticate,addComment)
router.delete("/:id",authenticate ,deleteComment)

export default router 