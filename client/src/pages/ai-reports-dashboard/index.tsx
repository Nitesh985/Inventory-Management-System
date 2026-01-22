import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';

import { ChatInput } from './components/ChatInput';

type SyncStatus = 'online' | 'syncing' | 'offline';


const AIReportsDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('online');
  const [chatInput, setChatInput] = useState<string>("")



  
  return (
    <div>
      <Header 
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        syncStatus={syncStatus}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        syncStatus={syncStatus}
      />
      <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-4 lg:pt-6 max-w-7xl">
          <ChatInput value={chatInput} onChange={(data)=>setChatInput(data)} />
          </div>
          </main>
          

      
    </div>
    
  )

  
};

export default AIReportsDashboard;