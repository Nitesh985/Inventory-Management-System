import { model, SYSTEM_PROMPT } from '../config/gemini.config.ts';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class GeminiService {
  async chat(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      // Build context from conversation history
      const context = conversationHistory
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      // Create the full prompt
      const fullPrompt = `${SYSTEM_PROMPT}

${context ? `Previous conversation:\n${context}\n` : ''}
User: ${userMessage}
Assistant:`;

      // Generate response
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate response. Please try again.');
    }
  }

  async generateBusinessSetupAdvice(businessType: string): Promise<string> {
    try {
      const prompt = `As a business advisor for Digital Khata, provide 3-5 key tips for setting up a ${businessType} business. Focus on inventory management, pricing strategy, and customer tracking. Keep it concise.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate business advice.');
    }
  }
}

export const geminiService = new GeminiService();
