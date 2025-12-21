import { Router } from 'express';
import { chatbotController } from '../controllers/chatbot.controllers.ts';

const router = Router();

router.post('/chat', chatbotController.chat);
router.post('/business-advice', chatbotController.getBusinessAdvice);

export default router;