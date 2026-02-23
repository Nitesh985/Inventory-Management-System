import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';
import { getChartData, type ChartDataPoint, type ChartData } from '../../../api/dashboard';

type ChartType = 'line' | 'area' | 'bar';
type TimeRange = '7days' | '30days' | '90days';

interface ChartTypeOption {
  key: ChartType;
  label: string;
  icon: string;
}

interface TimeRangeOption {
  key: TimeRange;
  label: string;
}

const BusinessChart: React.FC = () => {
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [totals, setTotals] = useState({ 
    sales: 0, 
    grossProfit: 0, 
    expenses: 0, 
    netProfit: 0 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getChartData(timeRange);
        // Backend wraps in ApiResponse: { statusCode, data: { chartData, totals }, message }
        // getChartData returns res.data (the full ApiResponse), so the chart payload
        // is nested at response.data.data, not response.data
        const data = (response as unknown as { data: { data: ChartData } }).data.data;
        
        // Use the data directly from backend which already has all metrics calculated
        setChartData(data?.chartData || []);
        
        // Use the totals from backend
        setTotals({
<<<<<<< HEAD
          sales: data?.totals?.sales || 0,
          cogs: data?.totals?.cogs || 0,
          grossProfit: data?.totals?.grossProfit || 0,
          expenses: data?.totals?.expenses || 0,
          netProfit: data?.totals?.netProfit || 0
=======
          sales: data.totals.totalSales || 0,
          grossProfit: data.totals.totalGrossProfit || 0,
          expenses: data.totals.totalExpenses || 0,
          netProfit: data.totals.totalNetProfit || 0
>>>>>>> refs/remotes/origin/main
        });
      } catch (err) {
        setError('Failed to load chart data');
        console.error('Chart data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [timeRange]);

  const chartTypes: ChartTypeOption[] = [
    { key: 'line', label: 'Line', icon: 'TrendingUp' },
    { key: 'area', label: 'Area', icon: 'BarChart3' },
    { key: 'bar', label: 'Bar', icon: 'BarChart' }
  ];

  const timeRanges: TimeRangeOption[] = [
    { key: '7days', label: '7 Days' },
    { key: '30days', label: '30 Days' },
    { key: '90days', label: '90 Days' }
  ];

  const renderChart = () => {
    const commonProps = {
      data: chartData,
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

              <linearGradient id="grossProfitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(239, 68, 68)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(239, 68, 68)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="netProfitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(168, 85, 247)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="rgb(168, 85, 247)" stopOpacity={0}/>
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
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="grossProfit"
              stroke="rgb(59, 130, 246)"
              fillOpacity={1}
              fill="url(#grossProfitGradient)"
              name="Gross Profit"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="rgb(239, 68, 68)"
              fillOpacity={1}
              fill="url(#expensesGradient)"
              name="Expenses"
            />
            <Area
              type="monotone"
              dataKey="netProfit"
              stroke="rgb(168, 85, 247)"
              fillOpacity={1}
              fill="url(#netProfitGradient)"
              name="Net Profit"
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
            <Bar dataKey="sales" fill="rgb(34, 197, 94)" name="Revenue" radius={[2, 2, 0, 0]} />
            <Bar dataKey="grossProfit" fill="rgb(59, 130, 246)" name="Gross Profit" radius={[2, 2, 0, 0]} />
            <Bar dataKey="expenses" fill="rgb(239, 68, 68)" name="Expenses" radius={[2, 2, 0, 0]} />
            <Bar dataKey="netProfit" fill="rgb(168, 85, 247)" name="Net Profit" radius={[2, 2, 0, 0]} />
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
              strokeWidth={2}
              dot={{ fill: 'rgb(34, 197, 94)', strokeWidth: 2, r: 3 }}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="grossProfit"
              stroke="rgb(59, 130, 246)"
              strokeWidth={2}
              dot={{ fill: 'rgb(59, 130, 246)', strokeWidth: 2, r: 3 }}
              name="Gross Profit"
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="rgb(239, 68, 68)"
              strokeWidth={2}
              dot={{ fill: 'rgb(239, 68, 68)', strokeWidth: 2, r: 3 }}
              name="Expenses"
            />
            <Line
              type="monotone"
              dataKey="netProfit"
              stroke="rgb(168, 85, 247)"
              strokeWidth={2}
              dot={{ fill: 'rgb(168, 85, 247)', strokeWidth: 2, r: 3 }}
              name="Net Profit"
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="w-full h-auto bg-card border border-border rounded-lg p-6 ">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0 ">
        <h2 className="text-lg font-semibold text-foreground">Business Performance</h2>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 ">
          {/* Chart Type Selector */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg ">
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
                <Icon name={type?.icon as any} size={14} />
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
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            {error}
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No data available for this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>
      {/* Chart Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="text-center">
            <div className="lg:text-xl text-base font-bold text-success">
              Rs. {Math.round(totals.sales).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Revenue</div>
          </div>
          <div className="text-center">
            <div className="lg:text-xl text-base font-bold text-primary">
              Rs. {Math.round(totals.grossProfit).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Gross Profit</div>
          </div>
          <div className="text-center">
            <div className="lg:text-xl text-base font-bold text-error">
              Rs. {Math.round(totals.expenses).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Expenses</div>
          </div>
          <div className="text-center">
            <div className={`lg:text-xl text-base font-bold ${totals.netProfit >= 0 ? 'text-purple-500' : 'text-error'}`}>
              Rs. {Math.round(totals.netProfit).toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Net Profit</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessChart;