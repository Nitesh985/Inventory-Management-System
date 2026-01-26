import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import QuickActions from './components/QuickActions';
import RecentTransactions from './components/RecentTransactions';
import InventoryAlerts from './components/InventoryAlerts';
import BusinessChart from './components/BusinessChart';
// import SyncStatus from './components/SyncStatus';
import { getDashboardMetrics } from '@/api/dashboard';
import type { DashboardPeriod, DashboardMetricsData } from '@/api/dashboard';
import { useAutoTour } from '@/hooks/useTour';
import '../../styles/tour.css';

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

const periodOptions: { value: DashboardPeriod; label: string }[] = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'all', label: 'All Time' },
];

const BusinessDashboard: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>('month');
  const [metricsData, setMetricsData] = useState<DashboardMetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldStartTour, setShouldStartTour] = useState(false);
  // const [syncStatus, setSyncStatus] = useState<SyncStatusType>('online');

  // Initialize tour for new users
  useAutoTour('business-dashboard', shouldStartTour);

  // Check if user should see the tour (first time visit)
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('hasCompletedTour');
    if (!hasCompletedTour) {
      setShouldStartTour(true);
      localStorage.setItem('hasCompletedTour', 'true');
    }
  }, []);

  // Fetch metrics when period changes
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const response = await getDashboardMetrics(selectedPeriod);
        setMetricsData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, [selectedPeriod]);

  const safeMetrics = {
    period: metricsData?.period ?? 'This Month',
    revenue: metricsData?.revenue ?? { total: 0, change: "", changeType: "neutral" as ChangeType },
    expenses: metricsData?.expenses ?? { total: 0, change: "", changeType: "neutral" as ChangeType },
    profit: metricsData?.profit ?? { total: 0, change: "", changeType: "neutral" as ChangeType },
    products: metricsData?.products ?? { total: 0, lowStock: 0 },
    todaysSales: metricsData?.todaysSales ?? { total: 0, change: "", changeType: "neutral" as ChangeType },
  };

  // Get comparison text based on period
  const getComparisonText = () => {
    switch (selectedPeriod) {
      case 'week': return 'vs last week';
      case 'month': return 'vs last month';
      case 'year': return 'vs last year';
      case 'all': return '';
      default: return 'vs last month';
    }
  };

  const comparisonText = getComparisonText();
  
  const businessMetrics: BusinessMetric[] = [
    {
      title: `Revenue (${safeMetrics.period})`,
      value: `Rs. ${Math.round(safeMetrics.revenue.total).toLocaleString()}`,
      change: selectedPeriod === 'all' ? 'All time total' : `${safeMetrics.revenue.change} ${comparisonText}`,
      changeType: safeMetrics.revenue.changeType,
      icon: "DollarSign",
      iconColor: "text-success",
      trend: selectedPeriod !== 'all'
    },
    {
      title: `Expenses (${safeMetrics.period})`,
      value: `Rs. ${Math.round(safeMetrics.expenses.total).toLocaleString()}`,
      change: selectedPeriod === 'all' ? 'All time total' : `${safeMetrics.expenses.change} ${comparisonText}`,
      changeType: safeMetrics.expenses.changeType,
      icon: "CreditCard",
      iconColor: "text-error",
      trend: selectedPeriod !== 'all'
    },
    {
      title: `Net Profit (${safeMetrics.period})`,
      value: `Rs. ${Math.round(safeMetrics.profit.total).toLocaleString()}`,
      change: selectedPeriod === 'all' ? 'All time total' : `${safeMetrics.profit.change} ${comparisonText}`,
      changeType: safeMetrics.profit.changeType,
      icon: "TrendingUp",
      iconColor: "text-primary",
      trend: selectedPeriod !== 'all'
    },
    {
      title: "Active Products",
      value: safeMetrics.products.total.toLocaleString(),
      change: `${safeMetrics.products.total} total items`,
      changeType: "neutral" as ChangeType,
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
        safeMetrics.products.lowStock > 0 ? "negative" as ChangeType : "positive" as ChangeType,
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
      <main className={`pt-16 pb-20 lg:pb-8 transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'
      }`}>
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div data-tour="welcome">
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  Business Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back! Here's what's happening with your business.
                </p>
              </div>
              <div className="flex items-center gap-2" data-tour="period-selector">
                <span className="text-sm text-muted-foreground">Period:</span>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as DashboardPeriod)}
                  className="bg-card border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-tour="metrics-cards">
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
          <div className="lg:flex hidden lg:mb-8 " data-tour="quick-actions">
            <QuickActions />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8 ">
            {/* Left Column - Chart */}
            <div className="lg:col-span-2" data-tour="business-chart">
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
            <div className="xl:col-span-2" data-tour="recent-transactions">
              <RecentTransactions />
            </div>
            
            {/* Inventory Alerts */}
            <div data-tour="inventory-alerts">
              <InventoryAlerts />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BusinessDashboard;