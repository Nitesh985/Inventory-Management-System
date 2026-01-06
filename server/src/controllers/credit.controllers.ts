import type { Request, Response } from "express";
import { Types } from 'mongoose'
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import Sales from "../models/sales.models.ts";
import Payment from "../models/payment.models.ts";
import Customer from "../models/customer.models.ts";
import Credit from "../models/credit.models.ts";

// ========================
// CREDIT CRUD OPERATIONS
// ========================

// Create a new credit entry
const createCredit = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const { customerId, amount, description, date } = req.body;

  if (!customerId) {
    throw new ApiError(400, "customerId is required");
  }
  if (amount === undefined || amount === null) {
    throw new ApiError(400, "amount is required");
  }

  // Verify customer exists and belongs to this shop
  const customer = await Customer.findOne({
    _id: new Types.ObjectId(customerId),
    shopId: new Types.ObjectId(shopId),
    deleted: false
  });
  if (!customer) {
    throw new ApiError(404, "Customer not found");
  }

  const credit = await Credit.create({
    shopId: new Types.ObjectId(shopId),
    customerId: new Types.ObjectId(customerId),
    amount: Number(amount),
    description: description || "",
    date: date ? new Date(date) : new Date(),
    deleted: false
  });

  // Populate customer info for response
  const populatedCredit = await Credit.findById(credit._id).populate('customerId', 'name phone');

  return res.status(201).json(new ApiResponse(201, populatedCredit, "Credit entry created"));
});

// Get all credits for the shop
const getCredits = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const { customerId } = req.query;

  const filter: any = {
    shopId: new Types.ObjectId(shopId),
    deleted: false
  };

  if (customerId) {
    filter.customerId = new Types.ObjectId(customerId as string);
  }

  const credits = await Credit.find(filter)
    .populate('customerId', 'name phone')
    .sort({ date: -1, createdAt: -1 });

  return res.status(200).json(new ApiResponse(200, credits, "Credits fetched"));
});

// Get credit by ID
const getCreditById = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const { id } = req.params;

  const credit = await Credit.findOne({
    _id: new Types.ObjectId(id),
    shopId: new Types.ObjectId(shopId),
    deleted: false
  }).populate('customerId', 'name phone');

  if (!credit) {
    throw new ApiError(404, "Credit entry not found");
  }

  return res.status(200).json(new ApiResponse(200, credit, "Credit fetched"));
});

// Update credit
const updateCredit = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const { id } = req.params;
  const updates = { ...req.body };
  
  // Prevent changing these fields
  delete updates._id;
  delete updates.shopId;
  delete updates.customerId;

  const credit = await Credit.findOneAndUpdate(
    {
      _id: new Types.ObjectId(id),
      shopId: new Types.ObjectId(shopId),
      deleted: false
    },
    { $set: updates },
    { new: true }
  ).populate('customerId', 'name phone');

  if (!credit) {
    throw new ApiError(404, "Credit entry not found");
  }

  return res.status(200).json(new ApiResponse(200, credit, "Credit updated"));
});

// Delete credit (soft delete)
const deleteCredit = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const { id } = req.params;

  const credit = await Credit.findOneAndUpdate(
    {
      _id: new Types.ObjectId(id),
      shopId: new Types.ObjectId(shopId),
      deleted: false
    },
    { $set: { deleted: true } },
    { new: true }
  );

  if (!credit) {
    throw new ApiError(404, "Credit entry not found");
  }

  return res.status(200).json(new ApiResponse(200, credit, "Credit deleted"));
});

// ========================
// CUSTOMERS WITH BALANCE (from Sales & Payments)
// ========================

// Get all customers with their balance calculated from credit sales and payments
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
    // Lookup credit sales for each customer
    {
      $lookup: {
        from: "sales",
        let: { customerId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$customerId", "$$customerId"] },
                  { $eq: ["$shopId", shopObjectId] },
                  { $eq: ["$paymentType", "CREDIT"] }
                ]
              }
            }
          }
        ],
        as: "creditSales"
      }
    },
    // Lookup payments for each customer
    {
      $lookup: {
        from: "payments",
        let: { customerId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$partyId", "$$customerId"] },
                  { $eq: ["$shopId", shopObjectId] },
                  { $eq: ["$partyType", "CUSTOMER"] }
                ]
              }
            }
          }
        ],
        as: "payments"
      }
    },
    // Calculate balance and stats
    {
      $addFields: {
        // Total credit given (sum of credit sales after discount)
        totalCredit: { 
          $sum: {
            $map: {
              input: "$creditSales",
              as: "sale",
              in: { $subtract: ["$$sale.totalAmount", { $ifNull: ["$$sale.discount", 0] }] }
            }
          }
        },
        // Total amount paid back
        totalPaid: { $sum: "$payments.amount" },
        // Number of credit transactions
        creditSalesCount: { $size: "$creditSales" },
        // Number of payments made
        paymentsCount: { $size: "$payments" },
        // Last credit sale date
        lastCreditSale: { $max: "$creditSales.createdAt" },
        // Last payment date
        lastPayment: { $max: "$payments.createdAt" }
      }
    },
    // Calculate balance (credit - paid = what they still owe)
    {
      $addFields: {
        balance: { $subtract: ["$totalCredit", "$totalPaid"] },
        lastTransaction: {
          $cond: {
            if: { $gt: ["$lastCreditSale", "$lastPayment"] },
            then: "$lastCreditSale",
            else: { $ifNull: ["$lastPayment", "$lastCreditSale"] }
          }
        }
      }
    },
    // Remove temporary arrays from output
    {
      $project: {
        creditSales: 0,
        payments: 0,
        lastCreditSale: 0,
        lastPayment: 0
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

// Get full credit history (credit sales + payments) for a customer
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

  // Get all credit sales for this customer
  const creditSales = await Sales.find({
    shopId: shopObjectId,
    customerId: customerObjectId,
    paymentType: "CREDIT"
  }).sort({ createdAt: -1 }).lean();

  // Get all payments for this customer
  const payments = await Payment.find({
    shopId: shopObjectId,
    partyId: customerObjectId,
    partyType: "CUSTOMER"
  }).sort({ createdAt: -1 }).lean();

  // Combine and format as unified history
  const history: Array<{
    _id: string;
    type: 'CREDIT' | 'PAYMENT';
    date: Date;
    amount: number;
    description: string;
    invoiceNo?: string;
    items?: any[];
    paymentMethod?: string;
    note?: string;
    runningBalance?: number;
  }> = [];

  // Add credit sales to history
  for (const sale of creditSales) {
    const saleAmount = sale.totalAmount - (sale.discount || 0);
    history.push({
      _id: sale._id.toString(),
      type: 'CREDIT',
      date: sale.createdAt,
      amount: saleAmount,
      description: `Credit Sale - Invoice #${sale.invoiceNo}`,
      invoiceNo: sale.invoiceNo,
      items: sale.items,
      note: sale.notes
    });
  }

  // Add payments to history
  for (const payment of payments) {
    history.push({
      _id: payment._id.toString(),
      type: 'PAYMENT',
      date: payment.createdAt,
      amount: payment.amount,
      description: `Payment received via ${payment.method}`,
      paymentMethod: payment.method,
      note: payment.note || undefined
    });
  }

  // Sort by date (newest first)
  history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Calculate running balance (oldest to newest, then reverse)
  const historyReversed = [...history].reverse();
  let runningBalance = 0;
  for (const item of historyReversed) {
    if (item.type === 'CREDIT') {
      runningBalance += item.amount;
    } else {
      runningBalance -= item.amount;
    }
    item.runningBalance = runningBalance;
  }

  // Calculate summary
  const totalCredit = creditSales.reduce((sum, s) => sum + (s.totalAmount - (s.discount || 0)), 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const currentBalance = totalCredit - totalPaid;

  return res.status(200).json(new ApiResponse(200, {
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address
    },
    summary: {
      totalCredit,
      totalPaid,
      currentBalance
    },
    history
  }, "Credit history fetched"));
});

// ========================
// CREDIT SUMMARY (existing)
// ========================

const getCustomersCreditSummary = asyncHandler(async (
  req: Request,
  res: Response
) => {
  const shopId = req.user!.activeShopId!
  const shopObjectId = new Types.ObjectId(shopId);

  // ============================
  // 1️⃣ Total CREDIT sales
  // ============================
  const creditSalesAgg = await Sales.aggregate([
    {
      $match: {
        shopId: shopObjectId,
        paymentType: "CREDIT",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalAmount" },
      },
    },
  ]);

  const totalCreditSales = creditSalesAgg[0]?.total ?? 0;

  // ============================
  // 2️⃣ Total customer payments
  // ============================
  const paymentAgg = await Payment.aggregate([
    {
      $match: {
        shopId: shopObjectId,
        partyType: "CUSTOMER",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);

  const totalCollected = paymentAgg[0]?.total ?? 0;

  // ============================
  // 3️⃣ Total receivable
  // ============================
  const totalReceivable = totalCreditSales - totalCollected;

  // ============================
  // 4️⃣ Active customers
  // ============================
  const activeCustomerIds = await Promise.all([
    // Customers with credit sales
    Sales.distinct("customerId", {
      shopId: shopObjectId,
      paymentType: "CREDIT",
    }),

    // Customers with payments
    Payment.distinct("partyId", {
      shopId: shopObjectId,
      partyType: "CUSTOMER",
    }),
  ]);

  const activeCustomerSet = new Set(
    activeCustomerIds.flat().map(id => id.toString())
  );

  const activeCustomersCount = activeCustomerSet.size;

  // ============================
  // 5️⃣ Per-customer breakdown (optional but useful)
  // ============================
  const customers = await Customer.find({ shopId: shopObjectId, deleted: false });

  let customersWithOutstanding = 0;
  let customersSettled = 0;
  let customersOverpaid = 0;

  for (const customer of customers) {
    const creditAgg = await Sales.aggregate([
      {
        $match: {
          shopId: shopObjectId,
          customerId: customer._id,
          paymentType: "CREDIT",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);

    const paymentAgg = await Payment.aggregate([
      {
        $match: {
          shopId: shopObjectId,
          partyType: "CUSTOMER",
          partyId: customer._id,
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const credit = creditAgg[0]?.total ?? 0;
    const paid = paymentAgg[0]?.total ?? 0;

    if (credit > paid) customersWithOutstanding++;
    else if (credit === paid && credit > 0) customersSettled++;
    else if (paid > credit) customersOverpaid++;
  }

  // ============================
  // RESPONSE
  // ============================
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


const getCustomerOutstanding = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = req.user!.activeShopId!
    const { customerId } = req.params;

    const customerObjectId = new Types.ObjectId(customerId);
    const shopObjectId = new Types.ObjectId(shopId);

    // Verify customer belongs to this shop
    const customer = await Customer.findOne({
      _id: customerObjectId,
      shopId: shopObjectId,
      deleted: false
    });
    if (!customer) throw new ApiError(404, "Customer not found");

    const data = await Sales.aggregate([
      // 1️⃣ Match customer + shop
      {
        $match: {
          customerId: customerObjectId,
          shopId: shopObjectId
        }
      },

      // 2️⃣ Join sale items
      {
        $lookup: {
          from: "saleitems",
          localField: "_id",
          foreignField: "saleId",
          as: "items"
        }
      },

      // 3️⃣ Flatten items
      {
        $unwind: "$items"
      },

      // 4️⃣ Join product
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },

      // 5️⃣ Flatten product
      {
        $unwind: "$product"
      },

      // 6️⃣ Prepare fields
      {
        $project: {
          createdAt: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          totalAmount: 1,
          paidAmount: 1,
          item: {
            productId: "$product._id",
            productName: "$product.name",
            quantity: "$items.quantity",
            price: "$items.price",
            total: "$items.total"
          }
        }
      },

      // 7️⃣ Group by date (internal _id only)
      {
        $group: {
          _id: "$createdAt",
          createdAt: { $first: "$createdAt" },
          items: { $push: "$item" },
          totalAmount: { $sum: "$totalAmount" },
          paidAmount: { $sum: "$paidAmount" }
        }
      },

      // 8️⃣ Compute outstanding
      {
        $addFields: {
          dueAmount: {
            $subtract: ["$totalAmount", "$paidAmount"]
          }
        }
      },

      // 9️⃣ Cleanup internal _id
      {
        $project: {
          _id: 0
        }
      },

      // 🔟 Sort latest first
      {
        $sort: { createdAt: -1 }
      }
    ]);

    return res.status(200).json(
      new ApiResponse(200, data, "Customer outstanding fetched")
    );
  }
);


export {
  createCredit,
  getCredits,
  getCreditById,
  updateCredit,
  deleteCredit,
  getCustomersWithBalance,
  getCustomerCreditHistory,
  getCustomerOutstanding,
  getCustomersCreditSummary
}
