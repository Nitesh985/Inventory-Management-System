import React from 'react';
import { Calendar, TrendingUp, Clock, Plus, MessageSquare } from 'lucide-react';

interface RecentChat {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

interface AIReasoningPanelProps {
  selectedTimeRange: string;
  onTimeRangeChange: (range: string) => void;
  recentChats: RecentChat[];
  onChatSelect: (chatId: string) => void;
  activeChat?: string;
  onNewChat: () => void;
  isCollapsed?: boolean;
}

export function AIReasoningPanel({ selectedTimeRange, onTimeRangeChange, recentChats, onChatSelect, activeChat, onNewChat, isCollapsed = false }: AIReasoningPanelProps) {
  const timeRanges = [
    { id: '90-days', label: 'Last 90 days' },
    { id: '60-days', label: 'Last 60 days' },
    { id: '30-days', label: 'Last 30 days' },
    { id: '7-days', label: 'Last 7 days' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-white border-l border-gray-200 scrollbar-hide">
      {isCollapsed ? (
        /* Collapsed View - Icon Only */
        <div className="flex flex-col items-center py-16 space-y-6">
          <button 
            onClick={onNewChat}
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
            title="New Chat"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
          <div className="w-10 h-px bg-gray-200" />
          <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors group" title="Recent Chats">
            <Clock className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
          </button>
          <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors group" title="Time Range">
            <Calendar className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
          </button>
          <button className="p-3 hover:bg-gray-100 rounded-lg transition-colors group" title="Analytics">
            <TrendingUp className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
          </button>
        </div>
      ) : (
        /* Expanded View - Full Content */
        <div className="p-4 md:p-6 space-y-6">
        {/* RECENT CHATS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <h3 className="text-sm font-bold text-gray-900">Recent Chats</h3>
            </div>
            
          </div>
          <button 
            onClick={onNewChat}
            className="w-full py-2 px-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 mb-3"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
          <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
            {recentChats.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-xs text-gray-500 font-medium">No recent chats</p>
              </div>
            ) : (
              recentChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all ${
                    activeChat === chat.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${
                      activeChat === chat.id ? 'bg-white/20' : 'bg-blue-100'
                    }`}>
                      <MessageSquare className={`w-3.5 h-3.5 ${
                        activeChat === chat.id ? 'text-white' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-xs mb-0.5 truncate ${
                        activeChat === chat.id ? 'text-white' : 'text-gray-900'
                      }`}>
                        {chat.title}
                      </h4>
                      <p className={`text-xs ${
                        activeChat === chat.id ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {chat.timestamp}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* TIME RANGE */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-bold text-gray-900">Time Range</h3>
          </div>
          <div className="space-y-2">
            {timeRanges.map((range) => (
              <button
                key={range.id}
                onClick={() => onTimeRangeChange(range.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedTimeRange === range.id
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONFIDENCE LEVEL */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-gray-600" />
            <h3 className="text-sm font-bold text-gray-900">Confidence Level</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Analysis Accuracy</span>
                <span className="text-sm font-bold text-green-600">High</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Based on 2,847 transactions</p>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
