import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

interface SeasonalData {
  month: string;
  sales: number;
  customers: number;
  avgOrder: number;
}

interface CustomerSegment {
  name: string;
  value: number;
  color: string;
  count: number;
}

interface InventoryTurnover {
  category: string;
  turnover: number;
  stock: number;
  prediction: string;
}

interface KeyInsight {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  actionable: boolean;
  icon: string;
}

const AdvancedAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('seasonal');

  const seasonalData: SeasonalData[] = [
    { month: 'Jan', sales: 42000, customers: 320, avgOrder: 131 },
    { month: 'Feb', sales: 38000, customers: 290, avgOrder: 131 },
    { month: 'Mar', sales: 45000, customers: 340, avgOrder: 132 },
    { month: 'Apr', sales: 48000, customers: 360, avgOrder: 133 },
    { month: 'May', sales: 52000, customers: 380, avgOrder: 137 },
    { month: 'Jun', sales: 58000, customers: 420, avgOrder: 138 },
    { month: 'Jul', sales: 62000, customers: 450, avgOrder: 138 },
    { month: 'Aug', sales: 59000, customers: 430, avgOrder: 137 },
    { month: 'Sep', sales: 65000, customers: 470, avgOrder: 138 },
    { month: 'Oct', sales: 68000, customers: 490, avgOrder: 139 },
    { month: 'Nov', sales: 72000, customers: 520, avgOrder: 138 }
  ];

  const customerSegmentData: CustomerSegment[] = [
    { name: 'New Customers', value: 35, color: '#1E40AF', count: 182 },
    { name: 'Returning Customers', value: 45, color: '#059669', count: 234 },
    { name: 'VIP Customers', value: 20, color: '#F59E0B', count: 104 }
  ];

  const inventoryTurnoverData: InventoryTurnover[] = [
    { category: 'Electronics', turnover: 8.5, stock: 45, prediction: 'High demand expected' },
    { category: 'Clothing', turnover: 6.2, stock: 78, prediction: 'Seasonal increase likely' },
    { category: 'Home & Garden', turnover: 4.8, stock: 32, prediction: 'Stable demand' },
    { category: 'Sports', turnover: 7.1, stock: 23, prediction: 'Restock recommended' },
    { category: 'Books', turnover: 3.2, stock: 67, prediction: 'Slow moving inventory' }
  ];

  const keyInsights: KeyInsight[] = [
    {
      title: 'Peak Season Opportunity',
      description: 'November shows 18% higher sales than average. Prepare inventory for December surge.',
      impact: 'High',
      actionable: true,
      icon: 'TrendingUp'
    },
    {
      title: 'Customer Retention Success',
      description: 'Returning customer rate increased by 12% this quarter, indicating strong loyalty.',
      impact: 'Medium',
      actionable: false,
      icon: 'Users'
    },
    {
      title: 'Inventory Optimization',
      description: 'Electronics category shows fastest turnover. Consider expanding this segment.',
      impact: 'High',
      actionable: true,
      icon: 'Package'
    },
    {
      title: 'Average Order Value Growth',
      description: 'AOV increased by $7 over the past 6 months, showing effective upselling.',
      impact: 'Medium',
      actionable: false,
      icon: 'DollarSign'
    }
  ];

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.name === 'sales' ? formatCurrency(entry?.value) : entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-error';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center space-x-1 mb-6 bg-muted rounded-lg p-1">
          <Button
            variant={activeTab === 'seasonal' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('seasonal')}
            className="flex-1"
          >
            <Icon name="Calendar" size={16} />
            Seasonal Trends
          </Button>
          <Button
            variant={activeTab === 'customer' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('customer')}
            className="flex-1"
          >
            <Icon name="Users" size={16} />
            Customer Behavior
          </Button>
          <Button
            variant={activeTab === 'inventory' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('inventory')}
            className="flex-1"
          >
            <Icon name="Package" size={16} />
            Inventory Analysis
          </Button>
        </div>

        {/* Seasonal Trends Tab */}
        {activeTab === 'seasonal' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Seasonal Sales Patterns</h3>
              <p className="text-sm text-muted-foreground">Analyze sales trends and customer behavior across months</p>
            </div>
            
            <div className="h-80 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={seasonalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="var(--color-primary)" 
                    fill="var(--color-primary)" 
                    fillOpacity={0.1}
                    name="Sales"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="customers" 
                    stroke="var(--color-success)" 
                    fill="var(--color-success)" 
                    fillOpacity={0.1}
                    name="Customers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="TrendingUp" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Peak Month</span>
                </div>
                <p className="text-xl font-bold text-foreground">November</p>
                <p className="text-sm text-muted-foreground">$72,000 in sales</p>
              </div>
              
              <div className="bg-success/5 rounded-lg p-4 border border-success/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="Users" size={16} className="text-success" />
                  <span className="text-sm font-medium text-success">Most Active</span>
                </div>
                <p className="text-xl font-bold text-foreground">November</p>
                <p className="text-sm text-muted-foreground">520 customers</p>
              </div>
              
              <div className="bg-warning/5 rounded-lg p-4 border border-warning/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon name="DollarSign" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-warning">Avg Order Value</span>
                </div>
                <p className="text-xl font-bold text-foreground">$138</p>
                <p className="text-sm text-muted-foreground">+5.3% vs last year</p>
              </div>
            </div>
          </div>
        )}

        {/* Customer Behavior Tab */}
        {activeTab === 'customer' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Customer Segmentation</h3>
              <p className="text-sm text-muted-foreground">Understanding customer types and behavior patterns</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={customerSegmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {customerSegmentData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry?.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value}%`, name]}
                      labelFormatter={() => ''}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                {customerSegmentData?.map((segment, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4 border border-border">
                    <div className="flex items-center space-x-3 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: segment?.color }}
                      ></div>
                      <span className="font-medium text-foreground">{segment?.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Percentage:</span>
                        <span className="font-medium text-foreground ml-2">{segment?.value}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Count:</span>
                        <span className="font-medium text-foreground ml-2">{segment?.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Inventory Analysis Tab */}
        {activeTab === 'inventory' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Inventory Turnover Analysis</h3>
              <p className="text-sm text-muted-foreground">Track inventory performance and AI predictions</p>
            </div>
            
            <div className="space-y-4">
              {inventoryTurnoverData?.map((item, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-foreground">{item?.category}</h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-muted-foreground">
                        Turnover: <span className="font-medium text-foreground">{item?.turnover}x</span>
                      </span>
                      <span className="text-muted-foreground">
                        Stock: <span className="font-medium text-foreground">{item?.stock} units</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon name="Brain" size={16} className="text-primary" />
                      <span className="text-sm text-muted-foreground">AI Prediction:</span>
                      <span className="text-sm font-medium text-foreground">{item?.prediction}</span>
                    </div>
                    
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((item?.turnover / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Key Insights */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Key Business Insights</h3>
            <p className="text-sm text-muted-foreground">AI-generated insights from your data analysis</p>
          </div>
          <Button variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} />
            Refresh Insights
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {keyInsights?.map((insight, index) => (
            <div key={index} className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name={insight?.icon} size={20} className="text-primary" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-foreground">{insight?.title}</h4>
                    <span className={`text-xs font-medium ${getImpactColor(insight?.impact)}`}>
                      {insight?.impact} Impact
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{insight?.description}</p>
                  
                  {insight?.actionable && (
                    <Button variant="outline" size="sm">
                      <Icon name="ArrowRight" size={14} />
                      Take Action
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;