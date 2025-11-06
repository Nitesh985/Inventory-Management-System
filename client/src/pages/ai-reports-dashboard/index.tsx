import React, { useState, useEffect } from 'react';
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

const AIReportsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [syncStatus, setSyncStatus] = useState('online');
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    // Simulate sync status changes
    const interval = setInterval(() => {
      const statuses = ['online', 'syncing', 'offline'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setSyncStatus(randomStatus);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const viewOptions = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'analytics', label: 'Advanced Analytics', icon: 'BarChart3' },
    { id: 'predictions', label: 'AI Predictions', icon: 'Brain' },
    { id: 'reports', label: 'Report Generator', icon: 'FileText' }
  ];

  const quickStats = [
    {
      title: 'Total Revenue',
      value: '$324,580',
      change: '+12.5%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'text-success'
    },
    {
      title: 'Total Expenses',
      value: '$198,240',
      change: '+8.3%',
      trend: 'up',
      icon: 'Receipt',
      color: 'text-error'
    },
    {
      title: 'Net Profit',
      value: '$126,340',
      change: '+18.2%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'text-success'
    },
    {
      title: 'Profit Margin',
      value: '38.9%',
      change: '+2.1%',
      trend: 'up',
      icon: 'Percent',
      color: 'text-primary'
    }
  ];

  const renderActiveView = () => {
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