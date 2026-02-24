import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import mongoose from "mongoose";

// Import all models
import Product from "../models/product.models.ts";
import Inventory from "../models/inventory.models.ts";
import Sales from "../models/sales.models.ts";
import Customer from "../models/customer.models.ts";
import Expense from "../models/expense.models.ts";
import Supplier from "../models/supplier.models.ts";
import Credit from "../models/credit.models.ts";
import Budget from "../models/budget.models.ts";
import Shop from "../models/shop.models.ts";
import Category from "../models/category.models.ts";

// ─── Tool Definitions ────────────────────────────────────────────────

const getProductsTool = tool(
  async ({ shopId, category, lowStockOnly, searchQuery }) => {
    const match: any = {
      shopId: new mongoose.Types.ObjectId(shopId),
      deleted: false,
    };
    if (category) match.category = category;
    if (searchQuery) match.name = { $regex: searchQuery, $options: "i" };

    const products = await Product.aggregate([
      { $match: match },
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "productId",
          as: "inventory",
        },
      },
      { $unwind: { path: "$inventory", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          stock: { $ifNull: ["$inventory.stock", 0] },
          minStock: { $ifNull: ["$inventory.minStock", 0] },
          isLowStock: {
            $lte: [
              { $ifNull: ["$inventory.stock", 0] },
              { $ifNull: ["$inventory.minStock", 0] },
            ],
          },
        },
      },
      { $project: { inventory: 0 } },
      ...(lowStockOnly
        ? [{ $match: { isLowStock: true } }]
        : []),
      { $limit: 50 },
    ]);

    if (products.length === 0) return "No products found matching the criteria.";

    const summary = products.map((p: any) => ({
      name: p.name,
      sku: p.sku,
      category: p.category || "Uncategorized",
      price: p.price,
      cost: p.cost,
      stock: p.stock,
      minStock: p.minStock,
      isLowStock: p.isLowStock,
    }));

    return JSON.stringify({
      totalFound: products.length,
      products: summary,
    });
  },
  {
    name: "get_products",
    description:
      "Get products from the shop's inventory. Can filter by category, search by name, or show only low-stock items. Returns product details including name, SKU, category, price, cost, stock level, and low stock status.",
    schema: z.object({
      shopId: z.string().describe("The shop ID"),
      category: z
        .string()
        .optional()
        .describe("Filter by product category name"),
      lowStockOnly: z
        .boolean()
        .optional()
        .describe("If true, only returns products where stock <= minStock"),
      searchQuery: z
        .string()
        .optional()
        .describe("Search products by name (partial match)"),
    }),
  }
);

const getSalesSummaryTool = tool(
  async ({ shopId, period, startDate, endDate }) => {
    const match: any = {
      shopId: new mongoose.Types.ObjectId(shopId),
    };

    const now = new Date();
    if (startDate && endDate) {
      match.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (period) {
      const periodDays: Record<string, number> = {
        today: 0,
        "7days": 7,
        "30days": 30,
        "90days": 90,
        year: 365,
      };
      const days = periodDays[period] ?? 30;
      const from = new Date(now);
      if (period === "today") {
        from.setHours(0, 0, 0, 0);
      } else {
        from.setDate(from.getDate() - days);
      }
      match.createdAt = { $gte: from };
    }

    const [summary] = await Sales.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalSales: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
          totalPaid: { $sum: "$paidAmount" },
          totalDiscount: { $sum: "$discount" },
          avgOrderValue: { $avg: "$totalAmount" },
          completedSales: {
            $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
          },
          pendingSales: {
            $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] },
          },
          creditSales: {
            $sum: {
              $cond: [{ $eq: ["$paymentMethod", "CREDIT"] }, 1, 0],
            },
          },
        },
      },
    ]);

    if (!summary) return "No sales found for the given period.";

    // Top selling products in this period
    const topProducts = await Sales.aggregate([
      { $match: match },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productName",
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.totalPrice" },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ]);

    // Payment method breakdown
    const paymentBreakdown = await Sales.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    return JSON.stringify({
      period: period || `${startDate} to ${endDate}`,
      totalSales: summary.totalSales,
      totalRevenue: Math.round(summary.totalRevenue),
      totalPaid: Math.round(summary.totalPaid),
      totalOutstanding: Math.round(summary.totalRevenue - summary.totalPaid),
      totalDiscount: Math.round(summary.totalDiscount),
      averageOrderValue: Math.round(summary.avgOrderValue),
      completedSales: summary.completedSales,
      pendingSales: summary.pendingSales,
      creditSales: summary.creditSales,
      topSellingProducts: topProducts.map((p: any) => ({
        product: p._id,
        quantity: p.totalQuantity,
        revenue: Math.round(p.totalRevenue),
      })),
      paymentMethodBreakdown: paymentBreakdown.map((pm: any) => ({
        method: pm._id || "CASH",
        count: pm.count,
        total: Math.round(pm.total),
      })),
    });
  },
  {
    name: "get_sales_summary",
    description:
      "Get sales summary and analytics. Shows total sales count, revenue, average order value, top selling products, payment method breakdown, and outstanding amounts. Can filter by time period or custom date range.",
    schema: z.object({
      shopId: z.string().describe("The shop ID"),
      period: z
        .enum(["today", "7days", "30days", "90days", "year"])
        .optional()
        .describe("Predefined time period for sales data"),
      startDate: z
        .string()
        .optional()
        .describe("Custom start date (ISO format) for sales data"),
      endDate: z
        .string()
        .optional()
        .describe("Custom end date (ISO format) for sales data"),
    }),
  }
);

const getCustomersTool = tool(
  async ({ shopId, searchQuery, withCredits }) => {
    const match: any = {
      shopId: new mongoose.Types.ObjectId(shopId),
      deleted: false,
    };
    if (searchQuery) match.name = { $regex: searchQuery, $options: "i" };

    const pipeline: any[] = [
      { $match: match },
      { $limit: 50 },
    ];

    if (withCredits) {
      pipeline.push(
        {
          $lookup: {
            from: "credits",
            let: { custId: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$customerId", "$$custId"] },
                      { $eq: ["$deleted", false] },
                    ],
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  totalCredit: {
                    $sum: {
                      $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
                    },
                  },
                  totalPayment: {
                    $sum: {
                      $cond: [{ $eq: ["$type", "PAYMENT"] }, "$amount", 0],
                    },
                  },
                },
              },
            ],
            as: "creditInfo",
          },
        },
        {
          $unwind: { path: "$creditInfo", preserveNullAndEmptyArrays: true },
        },
        {
          $addFields: {
            totalCredit: { $ifNull: ["$creditInfo.totalCredit", 0] },
            totalPayment: { $ifNull: ["$creditInfo.totalPayment", 0] },
            outstandingBalance: {
              $subtract: [
                { $ifNull: ["$creditInfo.totalCredit", 0] },
                { $ifNull: ["$creditInfo.totalPayment", 0] },
              ],
            },
          },
        },
        { $project: { creditInfo: 0 } }
      );
    }

    const customers = await Customer.aggregate(pipeline);
    if (customers.length === 0) return "No customers found.";

    const result = customers.map((c: any) => ({
      name: c.name,
      phone: c.contact?.[0] || "N/A",
      email: c.email || "N/A",
      address: c.address || "N/A",
      ...(withCredits
        ? {
            totalCredit: Math.round(c.totalCredit || 0),
            totalPayment: Math.round(c.totalPayment || 0),
            outstandingBalance: Math.round(c.outstandingBalance || 0),
          }
        : {}),
    }));

    return JSON.stringify({
      totalCustomers: customers.length,
      customers: result,
    });
  },
  {
    name: "get_customers",
    description:
      "Get customer information. Can search by name and optionally include credit/payment balances (outstanding amounts). Shows customer name, phone, email, address, and credit details.",
    schema: z.object({
      shopId: z.string().describe("The shop ID"),
      searchQuery: z
        .string()
        .optional()
        .describe("Search customers by name"),
      withCredits: z
        .boolean()
        .optional()
        .describe(
          "If true, includes credit/payment/outstanding balance for each customer"
        ),
    }),
  }
);

const getExpenseSummaryTool = tool(
  async ({ shopId, period, category }) => {
    const match: any = {
      shopId: new mongoose.Types.ObjectId(shopId),
      deleted: false,
    };

    if (category) match.category = category;

    const now = new Date();
    const periodDays: Record<string, number> = {
      "7days": 7,
      "30days": 30,
      "90days": 90,
      year: 365,
    };
    const days = periodDays[period || "30days"] ?? 30;
    const from = new Date(now);
    from.setDate(from.getDate() - days);
    match.date = { $gte: from };

    const [summary] = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
          count: { $sum: 1 },
          avgExpense: { $avg: "$amount" },
        },
      },
    ]);

    const byCategory = await Expense.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Check against budgets
    const budgets = await Budget.find({
      shopId: new mongoose.Types.ObjectId(shopId),
      deleted: false,
    }).lean();

    const budgetComparison = byCategory.map((cat: any) => {
      const budget = budgets.find(
        (b) => b.category === cat._id || b.categoryName === cat._id
      );
      return {
        category: cat._id || "Uncategorized",
        spent: Math.round(cat.total),
        count: cat.count,
        budgetLimit: budget ? budget.limit : null,
        overBudget: budget ? cat.total > budget.limit : null,
        budgetUtilization: budget
          ? Math.round((cat.total / budget.limit) * 100)
          : null,
      };
    });

    return JSON.stringify({
      period: period || "30days",
      totalExpenses: Math.round(summary?.totalExpenses || 0),
      expenseCount: summary?.count || 0,
      averageExpense: Math.round(summary?.avgExpense || 0),
      byCategory: budgetComparison,
    });
  },
  {
    name: "get_expense_summary",
    description:
      "Get expense summary with breakdown by category. Shows total expenses, count, average, and per-category totals with budget comparison (if budgets are set). Can filter by period and category.",
    schema: z.object({
      shopId: z.string().describe("The shop ID"),
      period: z
        .enum(["7days", "30days", "90days", "year"])
        .optional()
        .describe("Time period (default: 30days)"),
      category: z
        .string()
        .optional()
        .describe("Filter expenses by category name"),
    }),
  }
);

const getSuppliersTool = tool(
  async ({ shopId, searchQuery }) => {
    const match: any = {
      shopId: new mongoose.Types.ObjectId(shopId),
      deleted: false,
    };
    if (searchQuery) match.name = { $regex: searchQuery, $options: "i" };

    const suppliers = await Supplier.find(match)
      .select("name phone email company address notes")
      .limit(50)
      .lean();

    if (suppliers.length === 0) return "No suppliers found.";

    return JSON.stringify({
      totalSuppliers: suppliers.length,
      suppliers: suppliers.map((s: any) => ({
        name: s.name,
        company: s.company || "N/A",
        phone: s.phone || "N/A",
        email: s.email || "N/A",
        address: s.address || "N/A",
      })),
    });
  },
  {
    name: "get_suppliers",
    description:
      "Get supplier information. Returns supplier names, companies, phone numbers, emails, and addresses. Can search by name.",
    schema: z.object({
      shopId: z.string().describe("The shop ID"),
      searchQuery: z
        .string()
        .optional()
        .describe("Search suppliers by name"),
    }),
  }
);

const getBusinessOverviewTool = tool(
  async ({ shopId }) => {
    const sid = new mongoose.Types.ObjectId(shopId);

    const [shop, productCount, customerCount, supplierCount] =
      await Promise.all([
        Shop.findById(sid).lean(),
        Product.countDocuments({ shopId: sid, deleted: false }),
        Customer.countDocuments({ shopId: sid, deleted: false }),
        Supplier.countDocuments({ shopId: sid, deleted: false }),
      ]);

    // Low stock count
    const lowStockProducts = await Product.aggregate([
      { $match: { shopId: sid, deleted: false } },
      {
        $lookup: {
          from: "inventories",
          localField: "_id",
          foreignField: "productId",
          as: "inv",
        },
      },
      { $unwind: { path: "$inv", preserveNullAndEmptyArrays: true } },
      {
        $match: {
          $expr: {
            $lte: [
              { $ifNull: ["$inv.stock", 0] },
              { $ifNull: ["$inv.minStock", 0] },
            ],
          },
        },
      },
      { $count: "count" },
    ]);

    // Today's sales
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const [todaySales] = await Sales.aggregate([
      { $match: { shopId: sid, createdAt: { $gte: todayStart } } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // This month's sales
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const [monthSales] = await Sales.aggregate([
      { $match: { shopId: sid, createdAt: { $gte: monthStart } } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // This month's expenses
    const [monthExpenses] = await Expense.aggregate([
      {
        $match: {
          shopId: sid,
          deleted: false,
          date: { $gte: monthStart },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Outstanding credits
    const [creditSummary] = await Credit.aggregate([
      { $match: { shopId: sid, deleted: false } },
      {
        $group: {
          _id: null,
          totalCredit: {
            $sum: {
              $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
            },
          },
          totalPayment: {
            $sum: {
              $cond: [{ $eq: ["$type", "PAYMENT"] }, "$amount", 0],
            },
          },
        },
      },
    ]);

    const categories = await Category.find().lean();

    return JSON.stringify({
      shopName: shop?.name || "Unknown",
      businessType: shop?.businessType || "Other",
      currency: shop?.currency || "NPR",
      totalProducts: productCount,
      totalCustomers: customerCount,
      totalSuppliers: supplierCount,
      totalCategories: categories.length,
      lowStockItems: lowStockProducts[0]?.count || 0,
      todaySales: {
        count: todaySales?.count || 0,
        revenue: Math.round(todaySales?.revenue || 0),
      },
      thisMonth: {
        salesCount: monthSales?.count || 0,
        salesRevenue: Math.round(monthSales?.revenue || 0),
        expenses: Math.round(monthExpenses?.total || 0),
        profit: Math.round(
          (monthSales?.revenue || 0) - (monthExpenses?.total || 0)
        ),
      },
      outstandingCredits: {
        totalCredit: Math.round(creditSummary?.totalCredit || 0),
        totalPayments: Math.round(creditSummary?.totalPayment || 0),
        outstanding: Math.round(
          (creditSummary?.totalCredit || 0) -
            (creditSummary?.totalPayment || 0)
        ),
      },
    });
  },
  {
    name: "get_business_overview",
    description:
      "Get a comprehensive overview of the entire business. Returns shop info, total products/customers/suppliers counts, low stock items count, today's and this month's sales & revenue, monthly expenses, profit, and outstanding credit balances. Use this for general business health questions.",
    schema: z.object({
      shopId: z.string().describe("The shop ID"),
    }),
  }
);

const getCreditSummaryTool = tool(
  async ({ shopId, customerId }) => {
    const match: any = {
      shopId: new mongoose.Types.ObjectId(shopId),
      deleted: false,
    };
    if (customerId)
      match.customerId = new mongoose.Types.ObjectId(customerId);

    const creditsByCustomer = await Credit.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$customerId",
          totalCredit: {
            $sum: {
              $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
            },
          },
          totalPayment: {
            $sum: {
              $cond: [{ $eq: ["$type", "PAYMENT"] }, "$amount", 0],
            },
          },
          transactionCount: { $sum: 1 },
          lastTransaction: { $max: "$date" },
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      {
        $addFields: {
          outstanding: {
            $subtract: ["$totalCredit", "$totalPayment"],
          },
        },
      },
      { $sort: { outstanding: -1 } },
      { $limit: 30 },
    ]);

    if (creditsByCustomer.length === 0)
      return "No credit/payment records found.";

    const totalOutstanding = creditsByCustomer.reduce(
      (sum: number, c: any) => sum + (c.outstanding || 0),
      0
    );

    return JSON.stringify({
      totalOutstanding: Math.round(totalOutstanding),
      customersWithCredit: creditsByCustomer.length,
      details: creditsByCustomer.map((c: any) => ({
        customerName: c.customer.name,
        totalCredit: Math.round(c.totalCredit),
        totalPayment: Math.round(c.totalPayment),
        outstanding: Math.round(c.outstanding),
        transactions: c.transactionCount,
        lastTransaction: c.lastTransaction,
      })),
    });
  },
  {
    name: "get_credit_summary",
    description:
      "Get credit/payment summary showing which customers owe money (khata/udhar). Returns outstanding balances per customer, total credit given, total payments received, and overall outstanding amount.",
    schema: z.object({
      shopId: z.string().describe("The shop ID"),
      customerId: z
        .string()
        .optional()
        .describe(
          "Optional: specific customer ID to check credits for"
        ),
    }),
  }
);

const getSalesTrendTool = tool(
  async ({ shopId, days }) => {
    const daysCount = days || 30;
    const from = new Date();
    from.setDate(from.getDate() - daysCount);
    from.setHours(0, 0, 0, 0);

    const dailySales = await Sales.aggregate([
      {
        $match: {
          shopId: new mongoose.Types.ObjectId(shopId),
          createdAt: { $gte: from },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
          count: { $sum: 1 },
          items: { $sum: { $size: "$items" } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    if (dailySales.length === 0)
      return `No sales data found in the last ${daysCount} days.`;

    return JSON.stringify({
      period: `Last ${daysCount} days`,
      dailyTrend: dailySales.map((d: any) => ({
        date: d._id,
        revenue: Math.round(d.revenue),
        salesCount: d.count,
        itemsSold: d.items,
      })),
      summary: {
        totalDays: dailySales.length,
        totalRevenue: Math.round(
          dailySales.reduce((s: number, d: any) => s + d.revenue, 0)
        ),
        avgDailyRevenue: Math.round(
          dailySales.reduce((s: number, d: any) => s + d.revenue, 0) /
            dailySales.length
        ),
        bestDay: dailySales.reduce(
          (best: any, d: any) => (d.revenue > best.revenue ? d : best),
          dailySales[0]
        ),
      },
    });
  },
  {
    name: "get_sales_trend",
    description:
      "Get daily sales trend data over a period. Shows revenue, sales count, and items sold per day. Also provides average daily revenue and best performing day. Useful for identifying sales patterns.",
    schema: z.object({
      shopId: z.string().describe("The shop ID"),
      days: z
        .number()
        .optional()
        .describe("Number of days to look back (default: 30)"),
    }),
  }
);

// ─── All Tools ───────────────────────────────────────────────────────

const tools = [
  getProductsTool,
  getSalesSummaryTool,
  getCustomersTool,
  getExpenseSummaryTool,
  getSuppliersTool,
  getBusinessOverviewTool,
  getCreditSummaryTool,
  getSalesTrendTool,
];

// ─── Agent Factory ───────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are **Digital Khata AI** — an intelligent business analytics assistant for a Nepali inventory management system called "Digital Khata".

## Your Role
You help shop owners understand their business data by analyzing inventory, sales, expenses, customers, suppliers, and credits. You provide actionable insights, answers, and recommendations.

## Guidelines
- Always use the available tools to fetch REAL data from the database before answering. Never make up numbers.
- When the user asks about their business, sales, products, stock, customers, expenses, suppliers, or credits — use the appropriate tool with their shopId.
- Present data clearly with numbers, percentages, and comparisons where helpful.
- Use Nepali Rupees (Rs.) for currency values.
- Be concise but thorough. Use bullet points and tables when listing multiple items.
- If the user asks something that doesn't relate to their business data, you can still answer generally but clarify you're most helpful with business analytics.
- For greetings, introduce yourself briefly and suggest what you can help with.
- When reporting on low stock, outstanding credits, or problems, give clear actionable recommendations.
- Format responses with markdown for readability (bold, bullet points, etc.).

## Important
- The shopId will be provided to you. Always pass it to tools.
- Today's date is: ${new Date().toISOString().split("T")[0]}
- Currency: NPR (Nepali Rupees)`;

export function createAgent(shopId: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    apiKey,
    temperature: 0.3,
    maxOutputTokens: 4096,
  });

  const agent = createReactAgent({
    llm: model,
    tools,
    prompt: `${SYSTEM_PROMPT}\n\nThe current user's shopId is: "${shopId}". Use this shopId in all tool calls.`,
  });

  return agent;
}

export async function runAgent(
  shopId: string,
  message: string,
  conversationHistory?: Array<{ role: string; content: string }>
) {
  const agent = createAgent(shopId);

  // Build messages array
  const messages: Array<{ role: string; content: string }> = [];

  // Add conversation history if provided
  if (conversationHistory && conversationHistory.length > 0) {
    for (const msg of conversationHistory) {
      messages.push({
        role: msg.role === "user" ? "human" : "ai",
        content: msg.content,
      });
    }
  }

  // Add current user message
  messages.push({ role: "human", content: message });

  const result = await agent.invoke({
    messages,
  });

  // Extract the last AI message
  const aiMessages = result.messages.filter(
    (m: any) => m._getType?.() === "ai" || m.constructor?.name === "AIMessage"
  );

  const lastAiMessage = aiMessages[aiMessages.length - 1];
  const responseText =
    typeof lastAiMessage?.content === "string"
      ? lastAiMessage.content
      : JSON.stringify(lastAiMessage?.content || "I could not generate a response.");

  return responseText;
}
