import { Router } from "express";
import { generalChat, analyticsChat } from "../controllers/chatbot.controllers.ts";
import { verifyBusinessAuth } from "../middlewares/auth.middlewares.ts";

const router = Router();

// Public endpoint - landing page chatbot (no auth)
router.post("/chat", generalChat);

// Protected endpoint - AI analytics with data access (requires auth + shop)
router.post("/analytics", verifyBusinessAuth, analyticsChat);

export default router;
