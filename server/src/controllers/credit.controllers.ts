import type { Request, Response } from "express";
import { Types } from 'mongoose'
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import Credit from "../models/credit.models.ts";
import Customer from "../models/customer.models.ts";
import Sales from "../models/sales.models.ts";

// ========================
// CUSTOMERS WITH BALANCE (from Credit model)
// ========================

// Get all customers with their balance calculated from credit records
const getCustomersWithBalance = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const shopObjectId = new Types.ObjectId(shopId);

  const customersWithBalance = await Customer.aggregate([
    // Match customers for this shop
    {
      $match: {
        shopId: shopObjectId,
        deleted: false
      }
    },
    // Lookup credit records for each customer
    {
      $lookup: {
        from: "credits",
        let: { customerId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$customerId", "$$customerId"] },
                  { $eq: ["$shopId", shopObjectId] },
                  { $eq: ["$deleted", false] }
                ]
              }
            }
          }
        ],
        as: "creditRecords"
      }
    },
    // Calculate balance and stats
    {
      $addFields: {
        // Total credit given (CREDIT type records)
        totalCredit: {
          $sum: {
            $map: {
              input: { $filter: { input: "$creditRecords", as: "r", cond: { $eq: ["$$r.type", "CREDIT"] } } },
              as: "r",
              in: "$$r.amount"
            }
          }
        },
        // Total payments received (PAYMENT type records)
        totalPaid: {
          $sum: {
            $map: {
              input: { $filter: { input: "$creditRecords", as: "r", cond: { $eq: ["$$r.type", "PAYMENT"] } } },
              as: "r",
              in: "$$r.amount"
            }
          }
        },
        // Number of credit transactions
        creditCount: {
          $size: {
            $filter: { input: "$creditRecords", as: "r", cond: { $eq: ["$$r.type", "CREDIT"] } }
          }
        },
        // Number of payments
        paymentsCount: {
          $size: {
            $filter: { input: "$creditRecords", as: "r", cond: { $eq: ["$$r.type", "PAYMENT"] } }
          }
        },
        // Last transaction date
        lastTransaction: { $max: "$creditRecords.date" }
      }
    },
    // Calculate balance (credit - paid = what they still owe)
    {
      $addFields: {
        balance: { $subtract: ["$totalCredit", "$totalPaid"] }
      }
    },
    // Remove temporary array from output
    {
      $project: {
        creditRecords: 0
      }
    },
    // Sort by name
    {
      $sort: { name: 1 }
    }
  ]);

  return res.status(200).json(new ApiResponse(200, customersWithBalance, "Customers with balance fetched"));
});

// ========================
// CREDIT HISTORY FOR A CUSTOMER
// ========================

// Get full credit history (credits + payments) for a customer
const getCustomerCreditHistory = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const { customerId } = req.params;

  const shopObjectId = new Types.ObjectId(shopId);
  const customerObjectId = new Types.ObjectId(customerId);

  // Verify customer exists and belongs to this shop
  const customer = await Customer.findOne({
    _id: customerObjectId,
    shopId: shopObjectId,
    deleted: false
  });
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // Support optional limit query param
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 0;

  // Get credit records for this customer
  let query = Credit.find({
    shopId: shopObjectId,
    customerId: customerObjectId,
    deleted: false
  })
    .populate("saleId", "invoiceNo items")
    .sort({ date: -1 });

  if (limit > 0) {
    query = query.limit(limit);
  }

  const creditRecords = await query.lean();

  // Get total count for pagination info
  const totalCount = limit > 0
    ? await Credit.countDocuments({ shopId: shopObjectId, customerId: customerObjectId, deleted: false })
    : creditRecords.length;

  // Format as unified history with running balance
  const history = creditRecords.map((record) => ({
    _id: record._id.toString(),
    type: record.type,
    date: record.date,
    amount: record.amount,
    description: record.description,
    invoiceNo: (record.saleId as any)?.invoiceNo || undefined,
    items: (record.saleId as any)?.items || undefined,
    paymentMethod: record.paymentMethod || undefined,
    runningBalance: 0, // will be calculated below
  }));

  // Calculate running balance (oldest to newest)
  const historyOldestFirst = [...history].reverse();
  let runningBalance = 0;
  for (const item of historyOldestFirst) {
    if (item.type === "CREDIT") {
      runningBalance += item.amount;
    } else {
      runningBalance -= item.amount;
    }
    item.runningBalance = runningBalance;
  }

  // Calculate summary
  const totalCredit = creditRecords
    .filter((r) => r.type === "CREDIT")
    .reduce((sum, r) => sum + r.amount, 0);
  const totalPaid = creditRecords
    .filter((r) => r.type === "PAYMENT")
    .reduce((sum, r) => sum + r.amount, 0);
  const currentBalance = totalCredit - totalPaid;

  return res.status(200).json(new ApiResponse(200, {
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: (customer as any).phone,
      email: customer.email,
      address: customer.address
    },
    summary: {
      totalCredit,
      totalPaid,
      currentBalance
    },
    history,
    totalCount
  }, "Credit history fetched"));
});

// ========================
// CREDIT SUMMARY
// ========================

const getCustomersCreditSummary = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const shopId = req.user!.activeShopId!;
  const shopObjectId = new Types.ObjectId(shopId);

  // Aggregate all credit records for this shop
  const summaryAgg = await Credit.aggregate([
    {
      $match: {
        shopId: shopObjectId,
        deleted: false,
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        customers: { $addToSet: "$customerId" },
      },
    },
  ]);

  const creditEntry = summaryAgg.find((e) => e._id === "CREDIT");
  const paymentEntry = summaryAgg.find((e) => e._id === "PAYMENT");

  const totalCreditGiven = creditEntry?.total ?? 0;
  const totalCollected = paymentEntry?.total ?? 0;
  const totalReceivable = totalCreditGiven - totalCollected;

  // Unique customers involved in any credit activity
  const allCustomerIds = new Set([
    ...(creditEntry?.customers || []).map((id: any) => id.toString()),
    ...(paymentEntry?.customers || []).map((id: any) => id.toString()),
  ]);
  const activeCustomersCount = allCustomerIds.size;

  // Per-customer breakdown for stats
  const perCustomerAgg = await Credit.aggregate([
    {
      $match: {
        shopId: shopObjectId,
        deleted: false,
      },
    },
    {
      $group: {
        _id: { customerId: "$customerId", type: "$type" },
        total: { $sum: "$amount" },
      },
    },
    {
      $group: {
        _id: "$_id.customerId",
        credits: {
          $sum: { $cond: [{ $eq: ["$_id.type", "CREDIT"] }, "$total", 0] },
        },
        payments: {
          $sum: { $cond: [{ $eq: ["$_id.type", "PAYMENT"] }, "$total", 0] },
        },
      },
    },
  ]);

  let customersWithOutstanding = 0;
  let customersSettled = 0;
  let customersOverpaid = 0;

  for (const c of perCustomerAgg) {
    if (c.credits > c.payments) customersWithOutstanding++;
    else if (c.credits === c.payments && c.credits > 0) customersSettled++;
    else if (c.payments > c.credits) customersOverpaid++;
  }

  return res.status(200).json(new ApiResponse(200, {
    shopId,
    totalReceivable,
    totalCollected,
    activeCustomers: activeCustomersCount,
    stats: {
      customersWithOutstanding,
      customersSettled,
      customersOverpaid,
    },
  }, "Credit summary fetched"));
});

// ========================
// CUSTOMER OUTSTANDING
// ========================

const getCustomerOutstanding = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = req.user!.activeShopId!;
    const { customerId } = req.params;

    const customerObjectId = new Types.ObjectId(customerId);
    const shopObjectId = new Types.ObjectId(shopId);

    // Verify customer belongs to this shop
    const customer = await Customer.findOne({
      _id: customerObjectId,
      shopId: shopObjectId,
      deleted: false,
    });
    if (!customer) throw new ApiError(404, "Customer not found");

    // Aggregate credits per customer
    const agg = await Credit.aggregate([
      {
        $match: {
          shopId: shopObjectId,
          customerId: customerObjectId,
          deleted: false,
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalCredit = agg.find((e) => e._id === "CREDIT")?.total ?? 0;
    const totalPaid = agg.find((e) => e._id === "PAYMENT")?.total ?? 0;
    const dueAmount = totalCredit - totalPaid;

    // Get recent credit sales with details
    const recentCredits = await Credit.find({
      shopId: shopObjectId,
      customerId: customerObjectId,
      type: "CREDIT",
      deleted: false,
    })
      .populate("saleId", "invoiceNo items totalAmount paidAmount discount createdAt")
      .sort({ date: -1 })
      .limit(20)
      .lean();

    const creditSales = recentCredits.map((cr) => {
      const sale = cr.saleId as any;
      return {
        creditId: cr._id,
        invoiceNo: sale?.invoiceNo,
        items: sale?.items || [],
        totalAmount: sale?.totalAmount || cr.amount,
        paidAmount: sale?.paidAmount || 0,
        dueAmount: cr.amount,
        createdAt: sale?.createdAt || cr.date,
      };
    });

    return res.status(200).json(
      new ApiResponse(200, {
        customer: {
          _id: customer._id,
          name: customer.name,
        },
        totalCredit,
        totalPaid,
        dueAmount,
        creditSales,
      }, "Customer outstanding fetched")
    );
  }
);

// ========================
// CREATE PAYMENT (record against credit)
// ========================

const createPayment = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const { customerId, amount, method, note, date } = req.body;

  if (!customerId) {
    throw new ApiError(400, "customerId is required");
  }
  if (amount === undefined || amount === null || amount <= 0) {
    throw new ApiError(400, "Valid amount is required");
  }

  const shopObjectId = new Types.ObjectId(shopId);
  const customerObjectId = new Types.ObjectId(customerId);

  // Verify customer exists and belongs to this shop
  const customer = await Customer.findOne({
    _id: customerObjectId,
    shopId: shopObjectId,
    deleted: false
  });
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  // Create a PAYMENT type credit record
  const payment = await Credit.create({
    shopId: shopObjectId,
    customerId: customerObjectId,
    type: "PAYMENT",
    amount: Number(amount),
    description: note || `Payment received via ${method || "CASH"}`,
    paymentMethod: method || "CASH",
    date: date ? new Date(date) : new Date(),
  });

  // Update sale paidAmount and status for PENDING/PARTIALLY_PAID sales
  // Apply payment to oldest pending sales first
  let remainingPayment = Number(amount);
  const pendingSales = await Sales.find({
    shopId: shopObjectId,
    customerId: customerObjectId,
    status: { $in: ['PENDING', 'PARTIALLY_PAID'] },
  }).sort({ createdAt: 1 }); // oldest first

  for (const sale of pendingSales) {
    if (remainingPayment <= 0) break;

    const dueAmount = sale.totalAmount - (sale.discount || 0) - sale.paidAmount;
    if (dueAmount <= 0) continue;

    const paymentForThisSale = Math.min(remainingPayment, dueAmount);
    sale.paidAmount += paymentForThisSale;
    remainingPayment -= paymentForThisSale;

    const newDue = sale.totalAmount - (sale.discount || 0) - sale.paidAmount;
    if (newDue <= 0) {
      sale.status = 'COMPLETED';
    } else {
      sale.status = 'PARTIALLY_PAID';
    }

    await sale.save();
  }

  return res.status(201).json(new ApiResponse(201, payment, "Payment recorded successfully"));
});

export {
  createPayment,
  getCustomersWithBalance,
  getCustomerCreditHistory,
  getCustomerOutstanding,
  getCustomersCreditSummary
}
