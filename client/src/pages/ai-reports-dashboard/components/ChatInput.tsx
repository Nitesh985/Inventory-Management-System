import React from 'react';
import { Mic, Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const quickPrompts = [
    'Items to restock',
    'Sales trends',
    'Top customers',
    'Low stock alerts'
  ];

  return (
    <div className="p-4 bg-white">
      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2 mb-3">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onChange(prompt)}
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs md:text-sm rounded-full transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-2">
        <button className="flex-shrink-0 p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
          <Mic className="w-5 h-5 text-gray-600" />
        </button>
        
        <div className="flex-1 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your inventory, sales, customers..."
            rows={1}
            className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-blue-500 transition-colors text-sm md:text-base"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
        </div>

        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="flex-shrink-0 p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full transition-colors"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
