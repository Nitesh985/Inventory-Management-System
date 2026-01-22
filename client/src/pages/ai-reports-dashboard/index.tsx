import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SyncStatusIndicator from '../../components/ui/SyncStatusIndicator';
import QuickActionMenu from '../../components/ui/QuickActionMenu';

import { useFetch } from '@/hooks/useFetch';
import { getSales } from '@/api/sales';
import { getExpenses } from '@/api/expenses';
import { ChatInput } from './components/chatinput';

type SyncStatus = 'online' | 'syncing' | 'offline';
type ViewId = 'overview' | 'analytics' | 'predictions' | 'reports';

interface ViewOption {
  id: ViewId;
  label: string;
  icon: string;
}

interface QuickStat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
  color: string;
}

const AIReportsDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('online');

  
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
          <ChatInput value="" onChange={() => {}} />
          </div>
          </main>
          

      
    </div>
    
  )

  
};

export default AIReportsDashboard;