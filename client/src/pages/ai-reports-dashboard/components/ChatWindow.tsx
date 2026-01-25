import React, { useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  type: 'system' | 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ChatWindowProps {
  messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-white to-gray-50">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              AI
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              AI-Powered Shop Analytics
            </h3>
            <p className="text-gray-600 mb-6">
              Ask me anything about your inventory, sales, customers, or business insights.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors">
                <p className="text-sm font-medium text-gray-900">📦 Stock Analysis</p>
                <p className="text-xs text-gray-600 mt-1">Check inventory levels</p>
              </button>
              <button className="p-3 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors">
                <p className="text-sm font-medium text-gray-900">📈 Sales Trends</p>
                <p className="text-xs text-gray-600 mt-1">Analyze performance</p>
              </button>
              <button className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left transition-colors">
                <p className="text-sm font-medium text-gray-900">👥 Customer Insights</p>
                <p className="text-xs text-gray-600 mt-1">View customer data</p>
              </button>
              <button className="p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left transition-colors">
                <p className="text-sm font-medium text-gray-900">⚠️ Smart Alerts</p>
                <p className="text-xs text-gray-600 mt-1">Get recommendations</p>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
