import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import { ChatWindow } from './components/ChatWindow';
import { AIReasoningPanel } from './components/AIReasoningPanel';
import { ChatInput } from './components/ChatInput';

type SyncStatus = 'online' | 'syncing' | 'offline';

interface Message {
  id: string;
  type: 'system' | 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface RecentChat {
  id: string;
  title: string;
  timestamp: string;
  preview: string;
}

const AIReportsDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('online');
  const [chatInput, setChatInput] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('90-days');
  const [showRecentChats, setShowRecentChats] = useState<boolean>(false);
  const [showAIPanel, setShowAIPanel] = useState<boolean>(false);
  const [activeChatId, setActiveChatId] = useState<string>('');
  const [panelWidth, setPanelWidth] = useState<number>(384); // 96 * 4 = 384px (w-96)
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState<boolean>(false);

  // Mock messages
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Analysis based on your shop data',
      timestamp: new Date()
    }
  ]);

  // Mock recent chats
  const recentChats: RecentChat[] = [
    {
      id: '1',
      title: 'Stock Analysis - Last Week',
      timestamp: 'Today, 10:30 AM',
      preview: 'Items to restock this week based on sales velocity...'
    },
    {
      id: '2',
      title: 'Sales Forecast Q1 2026',
      timestamp: 'Yesterday, 3:45 PM',
      preview: 'Predicted sales trends for next quarter...'
    },
    {
      id: '3',
      title: 'Customer Credit Report',
      timestamp: 'Jan 23, 2026',
      preview: 'Top credit customers and payment analysis...'
    },
    {
      id: '4',
      title: 'Low Stock Alerts',
      timestamp: 'Jan 22, 2026',
      preview: 'Products running low on inventory...'
    }
  ];

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setChatInput('');

        setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Based on your shop data, I'm analyzing "${chatInput}". Here are the insights:\n\nThis is a simulated response. In production, this will be powered by Ollama running on your backend server, processing your actual shop data including inventory records, sales history, and customer information.`,
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    // In production, load chat history from backend
    console.log('Loading chat:', chatId);
  };

  const handleNewChat = () => {
    setActiveChatId('');
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
                          <h3 className="font-bold text-gray-900">Most Sold Items</h3>
                          <p className="text-xs text-gray-600">Top performing products</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-blue-600 mb-2">1,234</div>
                      <p className="text-sm text-gray-600">Total sales this month</p>
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
                      <div className="text-3xl font-bold text-green-600 mb-2">Rs. 45,678</div>
                      <p className="text-sm text-gray-600">+12% from last month</p>
                    </div>

                    {/* Inventory Status Card */}
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                          <Icon name="Package" size={24} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Inventory</h3>
                          <p className="text-xs text-gray-600">Stock status</p>
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-2">89%</div>
                      <p className="text-sm text-gray-600">Stock availability</p>
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
                        recentChats={recentChats}
                        onChatSelect={handleChatSelect}
                        activeChat={activeChatId}
                        onNewChat={handleNewChat}
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
