import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SyncStatusIndicator from '../../components/ui/SyncStatusIndicator';
import QuickActionMenu from '../../components/ui/QuickActionMenu';
import RevenueChart from './components/RevenueChart';
import PredictiveInsights from './components/PredictiveInsights';
import ReportGenerator from './components/ReportGenerator';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import { useFetch } from '@/hooks/useFetch';
import { getSales } from '@/api/sales';
import { getExpenses } from '@/api/expenses';

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
  const [activeView, setActiveView] = useState<ViewId>('overview');

  const { data: salesData } = useFetch(getSales, []);
  const { data: expensesData } = useFetch(getExpenses, []);

  // Calculate real stats from API data
  const quickStats: QuickStat[] = useMemo(() => {
    const sales = salesData || [];
    const expenses = expensesData || [];
    
    const totalRevenue = sales.reduce((sum: number, sale: any) => sum + (sale?.totalAmount || 0), 0);
    const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + (exp?.amount || 0), 0);
    const netProfit = totalRevenue - totalExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return [
      {
        title: 'Total Revenue',
        value: `Rs. ${totalRevenue.toLocaleString()}`,
        change: '+12.5%',
        trend: 'up' as const,
        icon: 'DollarSign',
        color: 'text-success'
      },
      {
        title: 'Total Expenses',
        value: `Rs. ${totalExpenses.toLocaleString()}`,
        change: '+8.3%',
        trend: 'up' as const,
        icon: 'Receipt',
        color: 'text-error'
      },
      {
        title: 'Net Profit',
        value: `Rs. ${netProfit.toLocaleString()}`,
        change: netProfit >= 0 ? '+18.2%' : '-5.0%',
        trend: netProfit >= 0 ? 'up' as const : 'down' as const,
        icon: 'TrendingUp',
        color: netProfit >= 0 ? 'text-success' : 'text-error'
      },
      {
        title: 'Profit Margin',
        value: `${profitMargin.toFixed(1)}%`,
        change: profitMargin >= 0 ? '+2.1%' : '-1.5%',
        trend: profitMargin >= 0 ? 'up' as const : 'down' as const,
        icon: 'Percent',
        color: 'text-primary'
      }
    ];
  }, [salesData, expensesData]);

  const viewOptions: ViewOption[] = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'analytics', label: 'Advanced Analytics', icon: 'BarChart3' },
    { id: 'predictions', label: 'AI Predictions', icon: 'Brain' },
    { id: 'reports', label: 'Report Generator', icon: 'FileText' }
  ];

  const renderActiveView = (): JSX.Element => {
    switch (activeView) {
      case 'analytics':
        return <AdvancedAnalytics />;
      case 'predictions':
        return <PredictiveInsights />;
      case 'reports':
        return <ReportGenerator />;
      default:
        return (
          <div className="space-y-6">
            <RevenueChart />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <AdvancedAnalytics />
              </div>
              <div>
                <PredictiveInsights />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        syncStatus={syncStatus}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        syncStatus={syncStatus}
      />
      <main className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      } pt-16 pb-20 lg:pb-6`}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="mb-4 lg:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="BarChart3" size={24} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">AI Reports Dashboard</h1>
                  <p className="text-muted-foreground">Intelligent business analytics and predictions</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <SyncStatusIndicator status={syncStatus} />
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} />
                Export Data
              </Button>
              <Button size="sm">
                <Icon name="RefreshCw" size={16} />
                Refresh Reports
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {quickStats?.map((stat, index) => (
              <div key={index} className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{stat?.title}</span>
                  <Icon name={stat?.icon} size={16} className={stat?.color} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{stat?.value}</p>
                  <div className="flex items-center space-x-1">
                    <Icon 
                      name={stat?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                      size={14} 
                      className={stat?.trend === 'up' ? 'text-success' : 'text-error'}
                    />
                    <span className={`text-sm font-medium ${
                      stat?.trend === 'up' ? 'text-success' : 'text-error'
                    }`}>
                      {stat?.change}
                    </span>
                    <span className="text-sm text-muted-foreground">vs last month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View Navigation */}
          <div className="bg-card rounded-lg border border-border p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {viewOptions?.map((option) => (
                <Button
                  key={option?.id}
                  variant={activeView === option?.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView(option?.id)}
                  className="flex items-center space-x-2"
                >
                  <Icon name={option?.icon} size={16} />
                  <span className="hidden sm:inline">{option?.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          {renderActiveView()}

          {/* Quick Actions (Mobile) */}
          <div className="lg:hidden mt-6">
            <QuickActionMenu />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIReportsDashboard;