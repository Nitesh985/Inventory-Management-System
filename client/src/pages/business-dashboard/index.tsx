import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import QuickActions from './components/QuickActions';
import RecentTransactions from './components/RecentTransactions';
import InventoryAlerts from './components/InventoryAlerts';
import BusinessChart from './components/BusinessChart';
import SyncStatus from './components/SyncStatus';

const BusinessDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [syncStatus, setSyncStatus] = useState('online');

  useEffect(() => {
    // Simulate sync status changes for demo
    const interval = setInterval(() => {
      const statuses = ['online', 'syncing', 'offline'];
      const randomStatus = statuses?.[Math.floor(Math.random() * statuses?.length)];
      setSyncStatus(randomStatus);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const businessMetrics = [
    {
      title: "Total Revenue",
      value: "$45,230",
      change: "+12.5%",
      changeType: "positive",
      icon: "DollarSign",
      iconColor: "text-success",
      trend: true
    },
    {
      title: "Total Expenses",
      value: "$28,450",
      change: "+8.2%",
      changeType: "negative",
      icon: "CreditCard",
      iconColor: "text-error",
      trend: true
    },
    {
      title: "Net Profit",
      value: "$16,780",
      change: "+18.7%",
      changeType: "positive",
      icon: "TrendingUp",
      iconColor: "text-primary",
      trend: true
    },
    {
      title: "Active Products",
      value: "1,247",
      change: "+5 new",
      changeType: "positive",
      icon: "Package",
      iconColor: "text-accent"
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "Needs attention",
      changeType: "negative",
      icon: "AlertTriangle",
      iconColor: "text-warning"
    },
    {
      title: "Today\'s Sales",
      value: "$2,340",
      change: "+15.3%",
      changeType: "positive",
      icon: "ShoppingCart",
      iconColor: "text-success",
      trend: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Business Dashboard - Digital Khata</title>
        <meta name="description" content="Monitor your business performance with comprehensive metrics, recent transactions, and inventory alerts in your Digital Khata dashboard." />
      </Helmet>
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
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Business Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back! Here's what's happening with your business today.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="text-sm text-muted-foreground">
                  Last updated: {new Date()?.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {businessMetrics?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                iconColor={metric?.iconColor}
                trend={metric?.trend}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8 ">
            <QuickActions />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Chart */}
            <div className="lg:col-span-2">
              <BusinessChart />
            </div>
            
            {/* Right Column - Sync Status */}
            <div>
              <SyncStatus />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Recent Transactions - Takes 2 columns on xl screens */}
            <div className="xl:col-span-2">
              <RecentTransactions />
            </div>
            
            {/* Inventory Alerts */}
            <div>
              <InventoryAlerts />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;