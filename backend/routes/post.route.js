import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  deletePost,
  uploadAuth,
  featurePost,
  reportPost,
  getReports,
  dismissReport,
  postLike,
  getAllPosts,
  updatePost as UpdatePost,
} from "../controllers/post.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/upload-auth", uploadAuth);

router.get("/", getPosts);
router.get("/all", getAllPosts);
router.get("/:slug", increaseVisit, getPost);
router.post("/create", createPost);
router.put("/update/:id", authenticate, UpdatePost); 
router.post("/:id/like", authenticate, postLike);
router.delete("/:id", deletePost);
router.patch("/feature", featurePost);
router.post("/reports",authenticate, reportPost);
router.get("/get/reports",authenticate,getReports);
router.delete("/reports/:id",authenticate, dismissReport);


export default router;
