import React from 'react';
import { Clock, Plus, MessageSquare } from 'lucide-react';

interface RecentChat {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

interface RecentChatsProps {
  chats: RecentChat[];
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  activeChat?: string;
}

export function RecentChats({ chats, onChatSelect, onNewChat, activeChat }: RecentChatsProps) {
  return (
    <div className="mt-20 h-90% flex flex-col bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-lg">
      {/* Header */}
      <div className="p-4 md:p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Recent Chats
          </h2>
        </div>
        <button 
          onClick={onNewChat}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>
      
      {/* Chats List */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {chats.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-medium">No recent chats</p>
            <p className="text-xs text-gray-400 mt-1">Start a new conversation</p>
          </div>
        ) : (
          <div className="space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`w-full text-left p-3 rounded-xl transition-all group ${
                  activeChat === chat.id
                    ? 'bg-blue-600 text-white shadow-md scale-[1.02]'
                    : 'hover:bg-white hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                    activeChat === chat.id ? 'bg-white/20' : 'bg-blue-100 group-hover:bg-blue-200'
                  }`}>
                    <MessageSquare className={`w-4 h-4 ${
                      activeChat === chat.id ? 'text-white' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm mb-1 truncate ${
                      activeChat === chat.id ? 'text-white' : 'text-gray-900 group-hover:text-gray-900'
                    }`}>
                      {chat.title}
                    </h3>
                    <p className={`text-xs mb-1.5 ${
                      activeChat === chat.id ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {chat.timestamp}
                    </p>
                    <p className={`text-xs line-clamp-2 ${
                      activeChat === chat.id ? 'text-blue-50' : 'text-gray-600'
                    }`}>
                      {chat.preview}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
