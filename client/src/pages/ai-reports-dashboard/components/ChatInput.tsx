import React from "react";
import { Icon, Mic } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ChatInput({ value, onChange }: ChatInputProps) {
  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-[200px] bg-[#F8F9FC] shadow-[0px_-22px_36px_0px_rgba(229,231,235,0.6)]">
      <div className="max-w-[1100px] mx-auto px-8 pt-6">
        {/* Quick filter chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-4 py-1.5 bg-[#E5E7EB] text-gray-700 text-sm rounded-full hover:bg-gray-300 transition-colors">
            Electronics
          </button>
          <button className="px-4 py-1.5 bg-[#E5E7EB] text-gray-700 text-sm rounded-full hover:bg-gray-300 transition-colors">
            Low Stock Items
          </button>
          <button className="px-4 py-1.5 bg-[#E5E7EB] text-gray-700 text-sm rounded-full hover:bg-gray-300 transition-colors">
            Last 30 Days
          </button>
          <button className="px-4 py-1.5 bg-[#E5E7EB] text-gray-700 text-sm rounded-full hover:bg-gray-300 transition-colors">
            AI Forecast
          </button>
          <button className="px-4 py-1.5 bg-[#E5E7EB] text-gray-700 text-sm rounded-full hover:bg-gray-300 transition-colors">
            Reorder Alerts
          </button>
        </div>

        {/* Main chat input */}
        <div className="flex items-center gap-4">
          {/* Microphone button */}
          <button className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 transition-all duration-200 p-3 rounded-full shadow-lg">
            <Mic className="w-6 h-6 text-white" />
          </button>

          {/* Input field */}
          <div className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center gap-3 shadow-sm">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="What would you like to know about your inventory?"
              className="flex-1 text-gray-900 text-base outline-none bg-transparent"
            />
            <button className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full hover:bg-blue-100 transition-colors">
              by: Category
            </button>
          </div>
          <button className="flex-shrink-0 bg-green-600 hover:bg-green-700 transition-all duration-200 px-6 py-3 rounded-lg text-white font-medium shadow-lg"></button>
        </div>
      </div>
    </div>
  );
}
