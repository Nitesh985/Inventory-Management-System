import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export type ChangeType = 'positive' | 'negative' | 'neutral';
export type DashboardPeriod = 'week' | 'month' | 'year' | 'all';

export interface MetricData {
  total: number;
  change: string;
  changeType: ChangeType;
}

export interface DashboardMetricsData {
  period: string;
  revenue: MetricData;
  expenses: MetricData;
  profit: MetricData;
  products: {
    total: number;
    lowStock: number;
  };
  todaysSales: MetricData;
}

export interface ChartDataPoint {
  date: string;
  sales: number;
  expenses: number;
  profit: number;
}

export interface ChartData {
  chartData: ChartDataPoint[];
  totals: {
    sales: number;
    expenses: number;
    profit: number;
  };
}

export async function getDashboardMetrics(period: DashboardPeriod = 'month'): Promise<{ data: DashboardMetricsData }> {
  const res = await api.get(`/dashboard/metrics?period=${period}`);
  return res.data; // Return { data: ... } so useFetch can access .data
}

export async function getChartData(range: '7days' | '30days' | '90days'): Promise<{ data: ChartData }> {
  const res = await api.get(`/dashboard/chart?range=${range}`);
  return res.data;
}

export default {
  getDashboardMetrics,
  getChartData,
};
