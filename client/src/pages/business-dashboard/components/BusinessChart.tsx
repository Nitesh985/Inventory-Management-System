import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';


const BusinessChart = () => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState('7days');

  const chartData = {
    '7days': [
      { date: 'Oct 28', sales: 1200, expenses: 800, profit: 400 },
      { date: 'Oct 29', sales: 1500, expenses: 900, profit: 600 },
      { date: 'Oct 30', sales: 1100, expenses: 700, profit: 400 },
      { date: 'Oct 31', sales: 1800, expenses: 1000, profit: 800 },
      { date: 'Nov 1', sales: 1600, expenses: 950, profit: 650 },
      { date: 'Nov 2', sales: 2000, expenses: 1200, profit: 800 },
      { date: 'Nov 3', sales: 1750, expenses: 1100, profit: 650 }
    ],
    '30days': [
      { date: 'Week 1', sales: 8500, expenses: 5200, profit: 3300 },
      { date: 'Week 2', sales: 9200, expenses: 5800, profit: 3400 },
      { date: 'Week 3', sales: 7800, expenses: 4900, profit: 2900 },
      { date: 'Week 4', sales: 10500, expenses: 6500, profit: 4000 }
    ],
    '90days': [
      { date: 'Aug', sales: 32000, expenses: 20000, profit: 12000 },
      { date: 'Sep', sales: 35500, expenses: 22000, profit: 13500 },
      { date: 'Oct', sales: 38200, expenses: 24000, profit: 14200 }
    ]
  };

  const currentData = chartData?.[timeRange];

  const chartTypes = [
    { key: 'line', label: 'Line', icon: 'TrendingUp' },
    { key: 'area', label: 'Area', icon: 'BarChart3' },
    { key: 'bar', label: 'Bar', icon: 'BarChart' }
  ];

  const timeRanges = [
    { key: '7days', label: '7 Days' },
    { key: '30days', label: '30 Days' },
    { key: '90days', label: '90 Days' }
  ];

  const renderChart = () => {
    const commonProps = {
      data: currentData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(34, 197, 94)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(34, 197, 94)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(239, 68, 68)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(239, 68, 68)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="rgb(34, 197, 94)"
              fillOpacity={1}
              fill="url(#salesGradient)"
              name="Sales"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="rgb(239, 68, 68)"
              fillOpacity={1}
              fill="url(#expensesGradient)"
              name="Expenses"
            />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Bar dataKey="sales" fill="rgb(34, 197, 94)" name="Sales" radius={[2, 2, 0, 0]} />
            <Bar dataKey="expenses" fill="rgb(239, 68, 68)" name="Expenses" radius={[2, 2, 0, 0]} />
            <Bar dataKey="profit" fill="rgb(59, 130, 246)" name="Profit" radius={[2, 2, 0, 0]} />
          </BarChart>
        );
      
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="rgb(34, 197, 94)"
              strokeWidth={3}
              dot={{ fill: 'rgb(34, 197, 94)', strokeWidth: 2, r: 4 }}
              name="Sales"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="rgb(239, 68, 68)"
              strokeWidth={3}
              dot={{ fill: 'rgb(239, 68, 68)', strokeWidth: 2, r: 4 }}
              name="Expenses"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="rgb(59, 130, 246)"
              strokeWidth={3}
              dot={{ fill: 'rgb(59, 130, 246)', strokeWidth: 2, r: 4 }}
              name="Profit"
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-lg font-semibold text-foreground">Business Performance</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Chart Type Selector */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {chartTypes?.map((type) => (
              <button
                key={type?.key}
                onClick={() => setChartType(type?.key)}
                className={`flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  chartType === type?.key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={type?.icon} size={14} />
                <span>{type?.label}</span>
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {timeRanges?.map((range) => (
              <button
                key={range?.key}
                onClick={() => setTimeRange(range?.key)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  timeRange === range?.key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Chart Container */}
      <div className="w-full h-80" aria-label="Business Performance Chart">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
      {/* Chart Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              ${currentData?.reduce((sum, item) => sum + item?.sales, 0)?.toLocaleString('en-US')}
            </div>
            <div className="text-sm text-muted-foreground">Total Sales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error">
              ${currentData?.reduce((sum, item) => sum + item?.expenses, 0)?.toLocaleString('en-US')}
            </div>
            <div className="text-sm text-muted-foreground">Total Expenses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              ${currentData?.reduce((sum, item) => sum + item?.profit, 0)?.toLocaleString('en-US')}
            </div>
            <div className="text-sm text-muted-foreground">Net Profit</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessChart;