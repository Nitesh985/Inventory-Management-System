import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import mongoose from 'mongoose'
import Sales from '../models/sales.models.ts'
import Expense from '../models/expense.models.ts'
import Product from '../models/product.models.ts'
import Inventory from '../models/inventory.models.ts'

type ChangeType = 'positive' | 'negative' | 'neutral';

interface MetricChange {
  value: string;
  type: ChangeType;
}

// Helper function to calculate percentage change
const calcPercentChange = (current: number, previous: number): MetricChange => {
  if (previous === 0) {
    if (current > 0) return { value: "+100%", type: "positive" };
    return { value: "0%", type: "neutral" };
  }
  const change = ((current - previous) / previous) * 100;
  const formatted = `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  return {
    value: formatted,
    type: change > 0 ? "positive" : change < 0 ? "negative" : "neutral"
  };
};

const getDashboardMetrics = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const shopObjectId = new mongoose.Types.ObjectId(shopId);

  // Get date boundaries
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(thisMonthStart.getTime() - 1);

  // Fetch all data in parallel
  const [allSales, allExpenses, allProducts, allInventory] = await Promise.all([
    Sales.find({ shopId: shopObjectId }).lean(),
    Expense.find({ shopId: shopObjectId }).lean(),
    Product.find({ shopId: shopObjectId }).lean(),
    Inventory.find({ shopId: shopObjectId }).lean(),
  ]);

  // Helper to check date ranges
  const isInRange = (date: Date | string, start: Date, end: Date): boolean => {
    const d = new Date(date);
    return d >= start && d <= end;
  };

  const isToday = (date: Date | string): boolean => new Date(date) >= today;
  const isYesterday = (date: Date | string): boolean => {
    const d = new Date(date);
    return d >= yesterday && d < today;
  };

  // Filter sales by period
  const thisMonthSales = allSales.filter(s => isInRange(s.createdAt, thisMonthStart, now));
  const lastMonthSales = allSales.filter(s => isInRange(s.createdAt, lastMonthStart, lastMonthEnd));
  const todaySalesList = allSales.filter(s => isToday(s.createdAt));
  const yesterdaySalesList = allSales.filter(s => isYesterday(s.createdAt));

  // Filter expenses by period
  const thisMonthExpenses = allExpenses.filter(e => isInRange(e.createdAt, thisMonthStart, now));
  const lastMonthExpenses = allExpenses.filter(e => isInRange(e.createdAt, lastMonthStart, lastMonthEnd));

  // Calculate revenue
  const totalRevenue = thisMonthSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const lastMonthRevenue = lastMonthSales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const revenueChange = calcPercentChange(totalRevenue, lastMonthRevenue);

  // Calculate expenses
  const totalExpenses = thisMonthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const lastMonthTotalExpenses = lastMonthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const expenseChange = calcPercentChange(totalExpenses, lastMonthTotalExpenses);
  // Invert expense change type (spending more = bad)
  const expenseChangeType: ChangeType = expenseChange.type === "positive" ? "negative" : expenseChange.type === "negative" ? "positive" : "neutral";

  // Calculate profit
  const netProfit = totalRevenue - totalExpenses;
  const profitChange = calcPercentChange(netProfit, lastMonthRevenue - lastMonthTotalExpenses);

  // Product metrics
  const totalProducts = allProducts.length;
  const lowStockItems = allInventory.filter(inv => {
    const product = allProducts.find(p => p._id.toString() === inv.productId?.toString());
    const reorderLevel = product?.reorderLevel || 10;
    return inv.stock <= reorderLevel;
  }).length;

  // Today's sales
  const todaysSales = todaySalesList.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const yesterdaysSales = yesterdaySalesList.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const todaySalesChange = calcPercentChange(todaysSales, yesterdaysSales);

  // Return calculated data for frontend to build metrics
  const data = {
    revenue: {
      total: totalRevenue,
      change: revenueChange.value,
      changeType: revenueChange.type,
    },
    expenses: {
      total: totalExpenses,
      change: expenseChange.value,
      changeType: expenseChangeType,
    },
    profit: {
      total: netProfit,
      change: profitChange.value,
      changeType: netProfit >= 0 ? profitChange.type : "negative" as ChangeType,
    },
    products: {
      total: totalProducts,
      lowStock: lowStockItems,
    },
    todaysSales: {
      total: todaysSales,
      change: todaySalesChange.value,
      changeType: todaySalesChange.type,
    },
  };

  return res.status(200).json(
    new ApiResponse(200, data, "Dashboard metrics fetched successfully")
  );
});

const getDashboard = asyncHandler((req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  return res.status(200).json(
    new ApiResponse(200, { message: "Dashboard data would be here.", shopId }, "Dashboard accessed successfully")
  );
});

// Chart data for business performance visualization
const getChartData = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const shopObjectId = new mongoose.Types.ObjectId(shopId);
  const range = (req.query.range as string) || '7days'; // '7days', '30days', '90days'

  const now = new Date();
  let startDate: Date;
  let groupBy: 'day' | 'week' | 'month';
  
  // Determine date range and grouping
  switch (range) {
    case '30days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      groupBy = 'week';
      break;
    case '90days':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      groupBy = 'month';
      break;
    default: // 7days
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      groupBy = 'day';
  }

  // Fetch sales and expenses in the date range
  const [sales, expenses] = await Promise.all([
    Sales.find({ 
      shopId: shopObjectId, 
      createdAt: { $gte: startDate, $lte: now } 
    }).lean(),
    Expense.find({ 
      shopId: shopObjectId, 
      createdAt: { $gte: startDate, $lte: now } 
    }).lean(),
  ]);

  // Group data by the appropriate period
  const chartData: { date: string; sales: number; expenses: number; profit: number }[] = [];

  if (groupBy === 'day') {
    // Group by day for 7 days
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const daySales = sales
        .filter(s => new Date(s.createdAt) >= dayStart && new Date(s.createdAt) < dayEnd)
        .reduce((sum, s) => sum + (s.totalAmount || 0), 0);
      
      const dayExpenses = expenses
        .filter(e => new Date(e.createdAt) >= dayStart && new Date(e.createdAt) < dayEnd)
        .reduce((sum, e) => sum + (e.amount || 0), 0);

      chartData.push({
        date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sales: daySales,
        expenses: dayExpenses,
        profit: daySales - dayExpenses,
      });
    }
  } else if (groupBy === 'week') {
    // Group by week for 30 days (4 weeks)
    for (let week = 4; week >= 1; week--) {
      const weekEnd = new Date(now.getTime() - (week - 1) * 7 * 24 * 60 * 60 * 1000);
      const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);

      const weekSales = sales
        .filter(s => new Date(s.createdAt) >= weekStart && new Date(s.createdAt) < weekEnd)
        .reduce((sum, s) => sum + (s.totalAmount || 0), 0);
      
      const weekExpenses = expenses
        .filter(e => new Date(e.createdAt) >= weekStart && new Date(e.createdAt) < weekEnd)
        .reduce((sum, e) => sum + (e.amount || 0), 0);

      chartData.push({
        date: `Week ${5 - week}`,
        sales: weekSales,
        expenses: weekExpenses,
        profit: weekSales - weekExpenses,
      });
    }
  } else {
    // Group by month for 90 days (3 months)
    for (let m = 2; m >= 0; m--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - m, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - m + 1, 0, 23, 59, 59);

      const monthSales = sales
        .filter(s => {
          const d = new Date(s.createdAt);
          return d >= monthDate && d <= monthEnd;
        })
        .reduce((sum, s) => sum + (s.totalAmount || 0), 0);
      
      const monthExpenses = expenses
        .filter(e => {
          const d = new Date(e.createdAt);
          return d >= monthDate && d <= monthEnd;
        })
        .reduce((sum, e) => sum + (e.amount || 0), 0);

      chartData.push({
        date: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        sales: monthSales,
        expenses: monthExpenses,
        profit: monthSales - monthExpenses,
      });
    }
  }

  // Calculate totals
  const totalSales = chartData.reduce((sum, d) => sum + d.sales, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
  const totalProfit = totalSales - totalExpenses;

  return res.status(200).json(
    new ApiResponse(200, {
      chartData,
      totals: {
        sales: totalSales,
        expenses: totalExpenses,
        profit: totalProfit,
      }
    }, "Chart data fetched successfully")
  );
});

export {
  getDashboard,
  getDashboardMetrics,
  getChartData
}
