import { Router } from 'express';
import { chatbotController } from '../controllers/chatbot.controllers.ts';
import { verifyBusinessAuth } from '../middlewares/auth.middlewares.ts';

const router = Router();

router.post('/chat', chatbotController.chat);
router.post('/business-advice', chatbotController.getBusinessAdvice);

// Analytics chat endpoint (requires authentication)
router.post('/analytics', verifyBusinessAuth, chatbotController.analyticsChat);

export default router;