import axios from "axios";


const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/chatbot`,
  withCredentials: true,
});

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnalyticsChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface AnalyticsChatResponse {
  success: boolean;
  data: {
    message: string;
    timestamp: string;
    context?: {
      dataPoints: {
        products: number;
        sales: number;
        lowStockItems: number;
      };
    };
  };
}

export async function sendAnalyticsChat(data: AnalyticsChatRequest): Promise<AnalyticsChatResponse> {
  const res = await api.post("/analytics", data);
  return res.data;
}

export async function sendGeneralChat(message: string, conversationHistory?: ChatMessage[]) {
  const res = await api.post("/chat", { message, conversationHistory });
  return res.data;
}
