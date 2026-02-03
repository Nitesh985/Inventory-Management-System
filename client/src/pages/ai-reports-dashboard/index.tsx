import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import { ChatWindow } from './components/ChatWindow';
import { AIReasoningPanel } from './components/AIReasoningPanel';
import { ChatInput } from './components/ChatInput';
import { getDashboardMetrics, type DashboardMetricsData } from '@/api/dashboard';
import { sendAnalyticsChat, type ChatMessage as APIChatMessage } from '@/api/chatbot';
import { 
  getAllChats, 
  createChat, 
  updateChat, 
  deleteChat as deleteChatAPI,
  archiveChat as archiveChatAPI,
  type Chat,
  type Message as ChatAPIMessage
} from '@/api/chat';

type SyncStatus = 'online' | 'syncing' | 'offline';

interface Message {
  id: string;
  type: 'system' | 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface RecentChat {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  preview: string;
  messages: Message[];
  isArchived?: boolean;
}

const AIReportsDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('online');
  const [chatInput, setChatInput] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('90-days');
  const [showRecentChats, setShowRecentChats] = useState<boolean>(false);
  const [showAIPanel, setShowAIPanel] = useState<boolean>(false);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [currentChatDbId, setCurrentChatDbId] = useState<string>(''); // Database ID of current chat
  const [panelWidth, setPanelWidth] = useState<number>(384); // 96 * 4 = 384px (w-96)
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);
  const [metricsData, setMetricsData] = useState<DashboardMetricsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Mock messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Analysis based on your shop data',
      timestamp: new Date()
    }
  ]);

  // Load recent chats from database on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await getAllChats();
        const chats: RecentChat[] = response.data.map((chat: Chat) => ({
          _id: chat._id,
          title: chat.title,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
          preview: chat.messages.length > 0 
            ? chat.messages[chat.messages.length - 1].content.substring(0, 80) 
            : 'No messages',
          messages: chat.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          isArchived: chat.isArchived
        }));
        setRecentChats(chats);
      } catch (error) {
        console.error('Failed to load chats from database:', error);
        setRecentChats([]);
      }
    };
    fetchChats();
  }, []);

  // Save or update chat in database
  const saveChatToDatabase = async (userQuery: string, aiResponse: string, existingMessages: Message[]) => {
    try {
      setSyncStatus('syncing');
      
      const allMessages: ChatAPIMessage[] = [
        ...existingMessages.map(msg => ({
          id: msg.id,
          type: msg.type,
          content: msg.content,
          timestamp: msg.timestamp
        }))
      ];

      if (currentChatDbId) {
        // Update existing chat
        const response = await updateChat(currentChatDbId, { messages: allMessages });
        
        // Update in local state
        setRecentChats(prev => prev.map(chat => 
          chat._id === currentChatDbId 
            ? {
                ...chat,
                messages: allMessages.map(msg => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp)
                })),
                preview: aiResponse.substring(0, 80),
                updatedAt: new Date().toISOString()
              }
            : chat
        ));
      } else {
        // Create new chat
        const title = userQuery.length > 50 ? userQuery.substring(0, 50) + '...' : userQuery;
        const response = await createChat(title, allMessages);
        
        const newChat: RecentChat = {
          _id: response.data._id,
          title: title,
          createdAt: response.data.createdAt,
          updatedAt: response.data.updatedAt,
          preview: aiResponse.substring(0, 80),
          messages: allMessages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }))
        };
        
        setRecentChats(prev => [newChat, ...prev]);
        setCurrentChatDbId(response.data._id);
        setActiveChatId(response.data._id);
      }
      
      setSyncStatus('online');
    } catch (error) {
      console.error('Failed to save chat to database:', error);
      setSyncStatus('offline');
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setChatInput('');

    // Add a loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: 'Analyzing your shop data...',
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // Prepare conversation history for API
      const conversationHistory: APIChatMessage[] = messages
        .filter(m => m.type !== 'system')
        .map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.content
        }));

      // Call the analytics API
      const response = await sendAnalyticsChat({
        message: chatInput,
        conversationHistory
      });

      // Remove loading message and add AI response
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'ai',
        content: response.data.message,
        timestamp: new Date()
      };

      setMessages((prev) => {
        const filtered = prev.filter(m => m.id !== loadingMessage.id);
        return [...filtered, aiMessage];
      });

      // Save to database after state update
      const updatedMessages = messages.filter(m => m.id !== loadingMessage.id);
      await saveChatToDatabase(chatInput, response.data.message, [...updatedMessages, aiMessage]);

    } catch (error: any) {
      console.error('Failed to get AI response:', error);
      
      // Determine error message based on error type
      let errorText = 'Sorry, I encountered an error analyzing your data. Please try again.';
      
      if (error?.response?.status === 401) {
        errorText = 'Authentication error. Please log out and log back in.';
      } else if (error?.response?.status === 400) {
        errorText = 'Invalid request. Please check your message and try again.';
      } else if (error?.response?.data?.error) {
        errorText = `Error: ${error.response.data.error}`;
      } else if (error?.message) {
        errorText = `Error: ${error.message}`;
      }
      
      // Remove loading message and show error
      setMessages((prev) => {
        const filtered = prev.filter(m => m.id !== loadingMessage.id);
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: errorText,
          timestamp: new Date()
        };
        return [...filtered, errorMessage];
      });
    }
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setCurrentChatDbId(chatId);
    const selectedChat = recentChats.find(chat => chat._id === chatId);
    if (selectedChat && selectedChat.messages) {
      setMessages(selectedChat.messages);
    }
  };

  const handleNewChat = () => {
    setActiveChatId('');
    setCurrentChatDbId('');
    setMessages([
      {
        id: '1',
        type: 'system',
        content: 'Analysis based on your shop data',
        timestamp: new Date()
      }
    ]);
    setChatInput('');
  };

  const handleDeleteChat = async (chatId: string) => {
    if (confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      try {
        await deleteChatAPI(chatId);
        setRecentChats(prev => prev.filter(chat => chat._id !== chatId));
        if (activeChatId === chatId) {
          handleNewChat();
        }
      } catch (error) {
        console.error('Failed to delete chat:', error);
        alert('Failed to delete chat. Please try again.');
      }
    }
  };

  const handleArchiveChat = async (chatId: string) => {
    try {
      await archiveChatAPI(chatId);
      setRecentChats(prev => prev.filter(chat => chat._id !== chatId));
      if (activeChatId === chatId) {
        handleNewChat();
      }
    } catch (error) {
      console.error('Failed to archive chat:', error);
      alert('Failed to archive chat. Please try again.');
    }
  };

  // Filter chats based on search query
  const filteredChats = searchQuery
    ? recentChats.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.preview.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : recentChats;

  // Fetch dashboard metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const response = await getDashboardMetrics('month');
        setMetricsData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 280 && newWidth <= 600) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="min-h-screen bg-background" style={{ cursor: isResizing ? 'col-resize' : 'default' }}>
      <Helmet>
        <title>AI Reports Dashboard - Digital Khata</title>
        <meta name="description" content="Get AI-powered insights and analysis of your business data with intelligent reports and recommendations." />
        <link rel="icon" type="image/jpeg" href="/src/assets/logo.jpeg" />
      </Helmet>
      <Header 
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        // syncStatus={syncStatus}
      />
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        // syncStatus={syncStatus}
      />
      
      <main
        className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
        }`}
      >
        <div className="p-4 lg:p-8 max-w-full mx-auto h-[calc(100vh-4rem)] flex flex-col">
          {/* Page Header */}
          <div className="mb-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                AI Reports
              </h1>
              <p className="text-muted-foreground mt-1">
                Get AI-powered insights and analysis based on your shop data.
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden rounded-lg border border-border shadow-sm">
            {/* Charts & Reports Area */}
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {/* Charts & Reports Content */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Placeholder for Charts/Reports */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Most Sold Items Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Icon name="TrendingUp" size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Total Products</h3>
                          <p className="text-xs text-gray-600">In your inventory</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {loading ? '...' : metricsData?.products?.total || 0}
                      </div>
                      <p className="text-sm text-gray-600">
                        {loading ? 'Loading...' : `${metricsData?.products?.lowStock || 0} low stock items`}
                      </p>
                    </div>

                    {/* Revenue Chart Card */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <Icon name="DollarSign" size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Revenue</h3>
                          <p className="text-xs text-gray-600">Monthly earnings</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {loading ? 'Rs. ...' : `Rs. ${Math.round(metricsData?.revenue?.total || 0).toLocaleString()}`}
                      </div>
                      <p className="text-sm text-gray-600">
                        {loading ? 'Loading...' : (metricsData?.revenue?.change || 'vs last month')}
                      </p>
                    </div>

                    {/* Today's Sales Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                          <Icon name="ShoppingCart" size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Today's Sales</h3>
                          <p className="text-xs text-gray-600">Sales made today</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {loading ? 'Rs. ...' : `Rs. ${Math.round(metricsData?.todaysSales?.total || 0).toLocaleString()}`}
                      </div>
                      <p className="text-sm text-gray-600">
                        {loading ? 'Loading...' : (metricsData?.todaysSales?.change || 'vs yesterday')}
                      </p>
                    </div>
                  </div>

                  {/* Placeholder for Chart */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Sales Trend</h3>
                    <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Icon name="BarChart3" size={48} className="text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Chart visualization will appear here</p>
                        <p className="text-gray-400 text-xs mt-1">Powered by your shop data</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant Overlay/Modal */}
            {isAIAssistantOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                  onClick={() => setIsAIAssistantOpen(false)}
                />
                
                {/* AI Assistant Panel */}
                <div className="fixed inset-y-0 right-0 z-50 flex">
                  <div
                    className="w-full sm:w-[500px] md:w-[600px] lg:w-[700px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
                    style={{ maxWidth: '90vw' }}
                  >
                    {/* AI Assistant Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Icon name="Bot" size={20} className="text-white" />
                        </div>
                        <div>
                          <h2 className="font-bold text-gray-900">AI Assistant</h2>
                          <p className="text-xs text-gray-500">Powered by Ollama</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsAIAssistantOpen(false)}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                      >
                        <Icon name="X" size={20} className="text-gray-600" />
                      </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-hidden">
                      <ChatWindow messages={messages} />
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-gray-200 bg-white">
                      <ChatInput
                        value={chatInput}
                        onChange={setChatInput}
                        onSend={handleSendMessage}
                      />
                    </div>

                    {/* Side Panel for Recent Chats & Settings */}
                    <div className="hidden lg:block absolute right-full w-80 h-full">
                      <AIReasoningPanel
                        selectedTimeRange={selectedTimeRange}
                        onTimeRangeChange={setSelectedTimeRange}
                        recentChats={filteredChats}
                        onChatSelect={handleChatSelect}
                        activeChat={activeChatId}
                        onNewChat={handleNewChat}
                        onDeleteChat={handleDeleteChat}
                        onArchiveChat={handleArchiveChat}
                        isCollapsed={false}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {/* Floating AI Assistant Button */}
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="fixed bottom-6 right-6 lg:bottom-8 lg:right-8 flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 z-40"
            >
              <Icon name="MessageSquare" size={20} />
              <span className="hidden sm:inline">AI Assistant</span>
            </button>          </div>
        </div>
      </main>
    </div>
  );
};

export default AIReportsDashboard;
