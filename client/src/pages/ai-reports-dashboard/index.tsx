import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
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
  const [selectedReport, setSelectedReport] = useState<string>('stock-analysis');

  const reportOptions = [
    { label: 'Stock Analysis', value: 'stock-analysis' },
    { label: 'Sales Report', value: 'sales-report' },
    { label: 'Customer Analysis', value: 'customer-analysis' },
    { label: 'Report Generation', value: 'report-generation' },
  ];

  return (
    <div>
      
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        syncStatus={syncStatus}
      />
      <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <Header
          onMenuToggle={() => {}}
          syncStatus={syncStatus}
        />
        
        <div className="px-4 lg:p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between space-x-3">
              <div className="flex space-x-2">
                <div className="w-12 h-12 bg-purple-600/10 rounded-lg flex items-center justify-center">
                  <Icon name="BarChart3" size={24} className="text-purple-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    AI Reports Dashboard
                  </h1>
                  <p className="text-muted-foreground">
                    Generate intelligent insights and comprehensive reports
                  </p>
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center justify-end gap-4 pb-0">
                <Select
                  options={reportOptions}
                  value={selectedReport}
                  onChange={setSelectedReport}
                  placeholder="Select Report Type"
                  className="md:w-56"
                />
              </div>
            </div>
          </div>

          <ChatInput value="" onChange={() => {}} />
        </div>
      </main>

      
    </div>
    
  )

  
};

export default AIReportsDashboard;