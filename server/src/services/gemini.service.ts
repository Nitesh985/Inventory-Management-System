import { model, SYSTEM_PROMPT } from '../config/gemini.config.ts';
import { ollamaService } from './ollama.service.ts';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class GeminiService {
  private useOllama: boolean;

  constructor() {
    this.useOllama = process.env.USE_OLLAMA === 'true';
  }

  async chat(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    // Try Ollama first if enabled
    if (this.useOllama) {
      try {
        const isOllamaHealthy = await ollamaService.checkHealth();
        if (isOllamaHealthy) {
          return await ollamaService.chat(userMessage, conversationHistory);
        }
      } catch (error) {
        console.log('Ollama unavailable, falling back to Gemini');
      }
    }

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

  async analyzeBusinessData(
    userQuery: string,
    shopContext: any,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    // Try Ollama first if enabled
    if (this.useOllama) {
      try {
        const isOllamaHealthy = await ollamaService.checkHealth();
        if (isOllamaHealthy) {
          return await ollamaService.analyzeBusinessData(userQuery, shopContext, conversationHistory);
        }
      } catch (error) {
        console.log('Ollama unavailable for analytics, falling back to Gemini');
      }
    }

    try {
      const context = conversationHistory
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      const analyticsPrompt = `You are an AI assistant for Digital Khata. Answer the user's question directly and concisely using the shop data provided.

**Shop Data:**
- Products: ${shopContext.products.total} (Categories: ${shopContext.products.categories.join(', ')})
- Total Sales: ${shopContext.sales.total} transactions, Revenue: Rs. ${shopContext.metrics.totalRevenue}
- Total Expenses: Rs. ${shopContext.metrics.totalExpenses}
- Net Profit: Rs. ${shopContext.metrics.totalProfit}
- Low Stock Items: ${shopContext.inventory.lowStock} products need restocking
- Customers: ${shopContext.customers.total}

**Recent Sales:** ${JSON.stringify(shopContext.sales.recentSales, null, 2)}
**Low Stock Items:** ${JSON.stringify(shopContext.inventory.lowStockItems, null, 2)}
**Recent Expenses:** ${JSON.stringify(shopContext.expenses.recentExpenses, null, 2)}

${context ? `Previous conversation:\n${context}\n` : ''}
**User Question:** ${userQuery}

**Instructions:**
- Answer ONLY what the user asked
- Keep it brief (1-3 sentences for simple questions)
- Use numbers from the data
- Add insights or recommendations ONLY if the user specifically asks for advice or analysis
- For simple questions like "how many items", "what is revenue", etc., just state the answer directly

**Your Response:**`;

      const result = await model.generateContent(analyticsPrompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini Analytics Error:', error);
      throw new Error('Failed to analyze business data. Please try again.');
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
