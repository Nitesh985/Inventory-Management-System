import React, { useState, useEffect } from 'react';
import {
  LineChart, Line,
  AreaChart, Area,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
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

const chartTypes: ChartTypeOption[] = [
  { key: 'line', label: 'Line', icon: 'TrendingUp' },
  { key: 'area', label: 'Area', icon: 'BarChart3' },
  { key: 'bar', label: 'Bar', icon: 'BarChart' },
];

const timeRanges: TimeRangeOption[] = [
  { key: '7days', label: '7 Days' },
  { key: '30days', label: '30 Days' },
  { key: '90days', label: '90 Days' },
];

const COLORS = {
  sales: 'rgb(34, 197, 94)',
  grossProfit: 'rgb(59, 130, 246)',
  expenses: 'rgb(239, 68, 68)',
  netProfit: 'rgb(168, 85, 247)',
};

const tooltipStyle: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const BusinessChart: React.FC = () => {
  const [chartType, setChartType] = useState<ChartType>('area');
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [totals, setTotals] = useState<ChartData['totals']>({
    sales: 0,
    cogs: 0,
    grossProfit: 0,
    expenses: 0,
    netProfit: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getChartData(timeRange);
        if (cancelled) return;
        // Backend wraps: { statusCode, data: { chartData, totals }, ... }
        // getChartData returns res.data → { data: { chartData, totals } }
        const payload = (response as any)?.data ?? response;
        setChartData(payload.chartData ?? []);
        // Backend sends totalSales, totalGrossProfit, etc.
        const t = payload.totals ?? {};
        setTotals({
          sales: t.totalSales ?? t.sales ?? 0,
          cogs: t.totalCogs ?? t.cogs ?? 0,
          grossProfit: t.totalGrossProfit ?? t.grossProfit ?? 0,
          expenses: t.totalExpenses ?? t.expenses ?? 0,
          netProfit: t.totalNetProfit ?? t.netProfit ?? 0,
        });
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load chart data');
          console.error('Chart data fetch error:', err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchChartData();
    return () => { cancelled = true; };
  }, [timeRange, retryCount]);

  const renderChart = (): React.JSX.Element => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    const gridProps = { strokeDasharray: '3 3', stroke: '#e5e7eb' };
    const xAxisProps = { dataKey: 'date' as const, stroke: '#6b7280', fontSize: 12 };
    const yAxisProps = { stroke: '#6b7280', fontSize: 12 };

    switch (chartType) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.sales} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.sales} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grossProfitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.grossProfit} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.grossProfit} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.expenses} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.expenses} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="netProfitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.netProfit} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.netProfit} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Area type="monotone" dataKey="sales" stroke={COLORS.sales} fillOpacity={1} fill="url(#salesGradient)" name="Sales" />
            <Area type="monotone" dataKey="grossProfit" stroke={COLORS.grossProfit} fillOpacity={1} fill="url(#grossProfitGradient)" name="Gross Profit" />
            <Area type="monotone" dataKey="expenses" stroke={COLORS.expenses} fillOpacity={1} fill="url(#expensesGradient)" name="Expenses" />
            <Area type="monotone" dataKey="netProfit" stroke={COLORS.netProfit} fillOpacity={1} fill="url(#netProfitGradient)" name="Net Profit" />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid {...gridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="sales" fill={COLORS.sales} name="Sales" radius={[2, 2, 0, 0]} />
            <Bar dataKey="grossProfit" fill={COLORS.grossProfit} name="Gross Profit" radius={[2, 2, 0, 0]} />
            <Bar dataKey="expenses" fill={COLORS.expenses} name="Expenses" radius={[2, 2, 0, 0]} />
            <Bar dataKey="netProfit" fill={COLORS.netProfit} name="Net Profit" radius={[2, 2, 0, 0]} />
          </BarChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <CartesianGrid {...gridProps} />
            <XAxis {...xAxisProps} />
            <YAxis {...yAxisProps} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke={COLORS.sales} strokeWidth={3} dot={{ fill: COLORS.sales, strokeWidth: 2, r: 4 }} name="Sales" />
            <Line type="monotone" dataKey="grossProfit" stroke={COLORS.grossProfit} strokeWidth={3} dot={{ fill: COLORS.grossProfit, strokeWidth: 2, r: 4 }} name="Gross Profit" />
            <Line type="monotone" dataKey="expenses" stroke={COLORS.expenses} strokeWidth={3} dot={{ fill: COLORS.expenses, strokeWidth: 2, r: 4 }} name="Expenses" />
            <Line type="monotone" dataKey="netProfit" stroke={COLORS.netProfit} strokeWidth={3} dot={{ fill: COLORS.netProfit, strokeWidth: 2, r: 4 }} name="Net Profit" />
          </LineChart>
        );
    }
  };

  return (
    <div className="w-full h-auto bg-card border border-border rounded-lg p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <h2 className="text-lg font-semibold text-foreground">Business Performance</h2>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Chart Type Selector */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {chartTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => setChartType(type.key)}
                className={`flex items-center space-x-1 px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  chartType === type.key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={type.icon as any} size={14} />
                <span>{type.label}</span>
              </button>
            ))}
          </div>

          {/* Time Range Selector */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {timeRanges.map((range) => (
              <button
                key={range.key}
                onClick={() => setTimeRange(range.key)}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-200 ${
                  timeRange === range.key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-80" aria-label="Business Performance Chart">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Icon name="AlertCircle" size={28} className="text-error" />
            <span>{error}</span>
            <button
              onClick={() => setRetryCount((c) => c + 1)}
              className="mt-1 text-sm text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Icon name="BarChart3" size={28} />
            <span>No data available for this period</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>

      {/* Chart Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
          <div className="text-center">
            <div className="lg:text-2xl text-lg font-bold text-success">
              Rs. {Math.round(totals.sales).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Sales</div>
          </div>
          <div className="text-center">
            <div className="lg:text-2xl text-lg font-bold text-primary">
              Rs. {Math.round(totals.grossProfit).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Gross Profit</div>
          </div>
          <div className="text-center">
            <div className="lg:text-2xl text-lg font-bold text-error">
              Rs. {Math.round(totals.expenses).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Expenses</div>
          </div>
          <div className="text-center">
            <div className={`lg:text-2xl text-lg font-bold ${totals.netProfit >= 0 ? 'text-success' : 'text-error'}`}>
              Rs. {Math.round(totals.netProfit).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Net Profit</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessChart;
