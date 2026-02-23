import axios from 'axios';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class OllamaService {
  private baseURL: string;
  private model: string;

  constructor() {
    this.baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.model = process.env.OLLAMA_MODEL || 'phi3:mini';
  }

  async chat(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
      const messages = [
        {
          role: 'system',
          content: 'You are an AI assistant for Digital Khata. Answer questions directly and briefly. Only provide detailed analysis when specifically asked.'
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: userMessage
        }
      ];

      const response = await axios.post(
        `${this.baseURL}/api/chat`,
        {
          model: this.model,
          messages: messages,
          stream: false
        },
        { timeout: 30000 }
      );

      return response.data.message.content;
    } catch (error: any) {
      console.error('Ollama API Error:', error.message);
      throw new Error('Failed to generate response from Ollama. Make sure Ollama is running.');
    }
  }

  async analyzeBusinessData(
    userQuery: string,
    shopContext: any,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const analyticsPrompt = `You are an AI assistant for Digital Khata. Answer the user's question directly using the shop data.

**Shop Data:**
- Products: ${shopContext.products.total} (Categories: ${shopContext.products.categories.join(', ')})
- Sales: ${shopContext.sales.total} transactions, Revenue: Rs. ${shopContext.metrics.totalRevenue}
- Expenses: Rs. ${shopContext.metrics.totalExpenses}, Profit: Rs. ${shopContext.metrics.totalProfit}
- Low Stock: ${shopContext.inventory.lowStock} items

**User Question:** ${userQuery}

**Instructions:** Answer ONLY what was asked. Keep it brief (1-3 sentences). Add insights ONLY if user asks for advice or analysis.`;

      const messages = [
        {
          role: 'system',
          content: 'You are an AI business analyst providing concise, data-driven insights for Digital Khata.'
        },
        ...conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: analyticsPrompt
        }
      ];

      const response = await axios.post(
        `${this.baseURL}/api/chat`,
        {
          model: this.model,
          messages: messages,
          stream: false
        },
        { timeout: 45000 }
      );

      return response.data.message.content;
    } catch (error: any) {
      console.error('Ollama Analytics Error:', error.message);
      throw new Error('Failed to analyze business data with Ollama.');
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/api/tags`, { timeout: 3000 });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export const ollamaService = new OllamaService();
