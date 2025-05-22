import express from "express";
import { getAnalytics } from "../controllers/analytics.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/overview", authenticate, getAnalytics); // only for admin maybe

export default router;
