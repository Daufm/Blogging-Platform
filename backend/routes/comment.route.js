import express from "express"
import { addComment, getPostComments 
    ,deleteComment, editeComment
} from "../controllers/comment.controller.js"
import { authenticate } from "../middlewares/auth.js"
const router = express.Router()

router.get("/:postId", getPostComments)
router.post("/:postId", authenticate,addComment)
router.delete("/:id",authenticate ,deleteComment)
router.delete("/delete/:id", authenticate,deleteComment);
router.patch("/edit/:id", authenticate,editeComment);

export default router 