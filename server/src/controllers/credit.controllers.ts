import type { Request, Response } from "express";
import { Types } from 'mongoose'
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import Sales from "../models/sales.models.ts";
import Payment from "../models/payment.models.ts";
import Customer from "../models/customer.models.ts";

async function getCustomersCreditSummary(
  req: Request,
  res: Response
) {
  try {
    const { shopId } = req.params;

    if (!Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid shopId" });
    }

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
    const customers = await Customer.find({ shopId: shopObjectId });

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
    return res.json({
      shopId,

      totalReceivable,
      totalCollected,
      activeCustomers: activeCustomersCount,

      stats: {
        customersWithOutstanding,
        customersSettled,
        customersOverpaid,
      },
    });
  } catch (error) {
    console.error("❌ getCustomerCreditSummary error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


const getCustomerOutstanding = asyncHandler(
  async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const { shopId } = req.body;

    const customerObjectId = new Types.ObjectId(customerId);
    const shopObjectId = new Types.ObjectId(shopId);

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
  getCustomerOutstanding,
  getCustomersCreditSummary
}