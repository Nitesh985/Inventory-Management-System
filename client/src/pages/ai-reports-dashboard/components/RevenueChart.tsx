import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface TooltipPayload {
  dataKey: string;
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const RevenueChart: React.FC = () => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [timeRange, setTimeRange] = useState<'6months' | 'year'>('6months');

  const revenueData: RevenueData[] = [
    { month: 'Jun 2024', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Jul 2024', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'Aug 2024', revenue: 48000, expenses: 33000, profit: 15000 },
    { month: 'Sep 2024', revenue: 58000, expenses: 38000, profit: 20000 },
    { month: 'Oct 2024', revenue: 62000, expenses: 41000, profit: 21000 },
    { month: 'Nov 2024', revenue: 67000, expenses: 43000, profit: 24000 }
  ];

  const yearlyData: RevenueData[] = [
    { month: 'Jan 2024', revenue: 38000, expenses: 28000, profit: 10000 },
    { month: 'Feb 2024', revenue: 42000, expenses: 30000, profit: 12000 },
    { month: 'Mar 2024', revenue: 39000, expenses: 29000, profit: 10000 },
    { month: 'Apr 2024', revenue: 44000, expenses: 31000, profit: 13000 },
    { month: 'May 2024', revenue: 41000, expenses: 30000, profit: 11000 },
    { month: 'Jun 2024', revenue: 45000, expenses: 32000, profit: 13000 },
    { month: 'Jul 2024', revenue: 52000, expenses: 35000, profit: 17000 },
    { month: 'Aug 2024', revenue: 48000, expenses: 33000, profit: 15000 },
    { month: 'Sep 2024', revenue: 58000, expenses: 38000, profit: 20000 },
    { month: 'Oct 2024', revenue: 62000, expenses: 41000, profit: 21000 },
    { month: 'Nov 2024', revenue: 67000, expenses: 43000, profit: 24000 }
  ];

  const getCurrentData = (): RevenueData[] => {
    return timeRange === 'year' ? yearlyData : revenueData;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    })?.format(value);
  };

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-modal">
          <p className="font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry) => (
            <p key={entry?.dataKey} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {formatCurrency(entry?.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Revenue Analysis</h3>
          <p className="text-sm text-muted-foreground">Track income, expenses, and profit trends</p>
        </div>
        
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={timeRange === '6months' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('6months')}
              className="text-xs"
            >
              6M
            </Button>
            <Button
              variant={timeRange === 'year' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange('year')}
              className="text-xs"
            >
              1Y
            </Button>
          </div>
          
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setChartType('line')}
            >
              <Icon name="TrendingUp" size={16} />
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="icon"
              onClick={() => setChartType('bar')}
            >
              <Icon name="BarChart3" size={16} />
            </Button>
          </div>
        </div>
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => value?.split(' ')?.[0]}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                name="Revenue"
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="var(--color-error)" 
                strokeWidth={3}
                name="Expenses"
                dot={{ fill: 'var(--color-error)', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="profit" 
                stroke="var(--color-success)" 
                strokeWidth={3}
                name="Profit"
                dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={getCurrentData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="month" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => value?.split(' ')?.[0]}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000)?.toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="var(--color-primary)" name="Revenue" />
              <Bar dataKey="expenses" fill="var(--color-error)" name="Expenses" />
              <Bar dataKey="profit" fill="var(--color-success)" name="Profit" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-sm text-muted-foreground">Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-error"></div>
          <span className="text-sm text-muted-foreground">Expenses</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-success"></div>
          <span className="text-sm text-muted-foreground">Profit</span>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;