import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import QuickActions from './components/QuickActions';
import RecentTransactions from './components/RecentTransactions';
import InventoryAlerts from './components/InventoryAlerts';
import BusinessChart from './components/BusinessChart';
// import SyncStatus from './components/SyncStatus';
import { useFetch } from '@/hooks/useFetch';
import { getDashboardMetrics } from '@/api/dashboard';

// type SyncStatusType = 'online' | 'syncing' | 'offline';
type ChangeType = 'positive' | 'negative' | 'neutral';

interface BusinessMetric {
  title: string;
  value: string;
  change: string;
  changeType: ChangeType;
  icon: string;
  iconColor: string;
  trend?: boolean;
}

const BusinessDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  // const [syncStatus, setSyncStatus] = useState<SyncStatusType>('online');

  // Fetch calculated metrics from API
  const { data: metricsData, loading } = useFetch(getDashboardMetrics);

  const safeMetrics = {
    revenue: metricsData?.revenue ?? { total: 0, change: "", changeType: "neutral" },
    expenses: metricsData?.expenses ?? { total: 0, change: "", changeType: "neutral" },
    profit: metricsData?.profit ?? { total: 0, change: "", changeType: "neutral" },
    products: metricsData?.products ?? { total: 0, lowStock: 0 },
    todaysSales: metricsData?.todaysSales ?? { total: 0, change: "", changeType: "neutral" },
  };

  
  // Build business metrics array from API data
  // const businessMetrics: BusinessMetric[] = metricsData ? [
  //   {
  //     title: "Total Revenue",
  //     value: `Rs. ${Math.round(metricsData?.revenue?.total).toLocaleString()}`,
  //     change: metricsData?.revenue?.change,
  //     changeType: metricsData?.revenue?.changeType,
  //     icon: "DollarSign",
  //     iconColor: "text-success",
  //     trend: true
  //   },
  //   {
  //     title: "Total Expenses",
  //     value: `Rs. ${Math.round(metricsData.expenses.total).toLocaleString()}`,
  //     change: metricsData.expenses.change,
  //     changeType: metricsData.expenses.changeType,
  //     icon: "CreditCard",
  //     iconColor: "text-error",
  //     trend: true
  //   },
  //   {
  //     title: "Net Profit",
  //     value: `Rs. ${Math.round(metricsData.profit.total).toLocaleString()}`,
  //     change: metricsData.profit.change,
  //     changeType: metricsData.profit.changeType,
  //     icon: "TrendingUp",
  //     iconColor: "text-primary",
  //     trend: true
  //   },
  //   {
  //     title: "Active Products",
  //     value: metricsData.products.total.toLocaleString(),
  //     change: `${metricsData.products.total} total items`,
  //     changeType: "neutral",
  //     icon: "Package",
  //     iconColor: "text-accent"
  //   },
  //   {
  //     title: "Low Stock Items",
  //     value: metricsData.products.lowStock.toString(),
  //     change: metricsData.products.lowStock > 0 ? `${metricsData.products.lowStock} need restock` : "Stock is healthy",
  //     changeType: metricsData.products.lowStock > 0 ? "negative" : "positive",
  //     icon: "AlertTriangle",
  //     iconColor: metricsData.products.lowStock > 0 ? "text-warning" : "text-success"
  //   },
  //   {
  //     title: "Today's Sales",
  //     value: `Rs. ${Math.round(metricsData.todaysSales.total).toLocaleString()}`,
  //     change: `${metricsData.todaysSales.change} vs yesterday`,
  //     changeType: metricsData.todaysSales.changeType,
  //     icon: "ShoppingCart",
  //     iconColor: "text-success",
  //     trend: true
  //   }
  // ] : [];
  
  const businessMetrics: BusinessMetric[] = [
    {
      title: "Total Revenue",
      value: `Rs. ${Math.round(safeMetrics.revenue.total).toLocaleString()}`,
      change: safeMetrics.revenue.change,
      changeType: safeMetrics.revenue.changeType,
      icon: "DollarSign",
      iconColor: "text-success",
      trend: true
    },
    {
      title: "Total Expenses",
      value: `Rs. ${Math.round(safeMetrics.expenses.total).toLocaleString()}`,
      change: safeMetrics.expenses.change,
      changeType: safeMetrics.expenses.changeType,
      icon: "CreditCard",
      iconColor: "text-error",
      trend: true
    },
    {
      title: "Net Profit",
      value: `Rs. ${Math.round(safeMetrics.profit.total).toLocaleString()}`,
      change: safeMetrics.profit.change,
      changeType: safeMetrics.profit.changeType,
      icon: "TrendingUp",
      iconColor: "text-primary",
      trend: true
    },
    {
      title: "Active Products",
      value: safeMetrics.products.total.toLocaleString(),
      change: `${safeMetrics.products.total} total items`,
      changeType: "neutral",
      icon: "Package",
      iconColor: "text-accent"
    },
    {
      title: "Low Stock Items",
      value: safeMetrics.products.lowStock.toString(),
      change:
        safeMetrics.products.lowStock > 0
          ? `${safeMetrics.products.lowStock} need restock`
          : "Stock is healthy",
      changeType:
        safeMetrics.products.lowStock > 0 ? "negative" : "positive",
      icon: "AlertTriangle",
      iconColor:
        safeMetrics.products.lowStock > 0 ? "text-warning" : "text-success"
    },
    {
      title: "Today's Sales",
      value: `Rs. ${Math.round(safeMetrics.todaysSales.total).toLocaleString()}`,
      change: `${safeMetrics.todaysSales.change} vs yesterday`,
      changeType: safeMetrics.todaysSales.changeType,
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
        // syncStatus={syncStatus}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        // syncStatus={syncStatus}
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
                {/* <div className="text-sm text-muted-foreground">
                  Last updated: {new Date()?.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div> */}
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-8 w-8 bg-muted rounded"></div>
                  </div>
                  <div className="h-8 bg-muted rounded w-32 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-20"></div>
                </div>
              ))
            ) : (
              businessMetrics?.map((metric, index) => (
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
              ))
            )}
          </div>

          {/* Quick Actions */}
          <div className="lg:flex hidden lg:mb-8 ">
            <QuickActions />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 ">
            {/* Left Column - Chart */}
            <div className="lg:col-span-2">
              <BusinessChart />
            </div>
            
            {/* Right Column - Sync Status */}
            <div>
              {/* <SyncStatus /> */}
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