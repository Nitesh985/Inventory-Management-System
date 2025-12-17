import type { Request, Response } from 'express';
import { geminiService } from '../services/gemini.service.ts';

export class ChatbotController {
  async chat(req: Request, res: Response) {
    try {
      console.log(req.body);
      const { message, conversationHistory } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ 
          success: false, 
          error: 'Message is required' 
        });
      }

      const response = await geminiService.chat(message, conversationHistory);

      res.json({
        success: true,
        data: {
          message: response,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to process chat message'
      });
    }
  }

  async getBusinessAdvice(req: Request, res: Response) {
    try {
      const { businessType } = req.body;

      if (!businessType) {
        return res.status(400).json({
          success: false,
          error: 'Business type is required'
        });
      }

      const advice = await geminiService.generateBusinessSetupAdvice(businessType);

      res.json({
        success: true,
        data: { advice }
      });
    } catch (error: any) {
      console.error('Business advice error:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to generate business advice'
      });
    }
  }
}

export const chatbotController = new ChatbotController();