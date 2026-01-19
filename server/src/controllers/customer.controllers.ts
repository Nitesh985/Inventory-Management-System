import type { Request, Response } from "express";
import mongoose from 'mongoose'
import { asyncHandler } from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import Customer from "../models/customer.models.ts";
import Sales from "../models/sales.models.ts";

const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  console.log(shopId)
  const { name, phone, address, email } = req.body;

  if (!name) {
    throw new ApiError(400, "name is required");
  }
  console.log(shopId)
  // prevent duplicates by phone or email within same shop
  if (phone) {
    const existingByPhone = await Customer.findOne({ 
      shopId: new mongoose.Types.ObjectId(shopId), 
      phone,
      deleted: false 
    });

  }
  
  if (email) {
    const existingByEmail = await Customer.findOne({ 
      shopId: new mongoose.Types.ObjectId(shopId), 
      email: email.toLowerCase(), 
      deleted: false 
    });

  }

  const customer = await Customer.create({
    shopId: new mongoose.Types.ObjectId(shopId),
    name,
    phone: phone || "",
    address: address || "",
    email: email ? email.toLowerCase() : "",
    notes: "",
    deleted: false,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, customer, "Customer created"));
});

const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  
  const customers = await Customer.find({ 
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false 
  });
  
  return res
    .status(200)
    .json(new ApiResponse(200, customers, "Customers fetched"));
});

const getCustomer = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const customer = await Customer.findOne({
    _id: req.params.id,
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false
  });
  if (!customer)
    throw new ApiError(404, "Customer not found");
  return res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer fetched"));
});

const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const updates = { ...req.body };
  delete updates._id;
  delete updates.shopId; // Prevent changing shopId
  
  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id, shopId: new mongoose.Types.ObjectId(shopId), deleted: false },
    { $set: updates },
    { new: true },
  );
  if (!customer) throw new ApiError(404, "Customer not found");
  return res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer updated"));
});

const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  // soft delete
  const customer = await Customer.findOneAndUpdate(
    { _id: req.params.id, shopId: new mongoose.Types.ObjectId(shopId), deleted: false },
    { $set: { deleted: true } },
    { new: true },
  );
  if (!customer) throw new ApiError(404, "Customer not found");
  return res
    .status(200)
    .json(new ApiResponse(200, customer, "Customer deleted"));
});

const getCustomerOutstanding = asyncHandler(
  async (req: Request, res: Response) => {
    const shopId = req.user!.activeShopId!
    const { customerId } = req.params;

    const customerObjectId = new mongoose.Types.ObjectId(customerId);
    const shopObjectId = new mongoose.Types.ObjectId(shopId);

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



// const getCustomerOutstanding = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { customerId } = req.params;
//     const shopId = req.body?.shopId;

//     if (!customerId || !shopId) {
//       throw new ApiError(400, "customerId and shopId are required");
//     }

//     const data = await Sales.aggregate([
//       {
//         $match: {
//           customerId,
//           shopId,
//           deleted: { $ne: true }, // if your Sales has deleted
//         },
//       },

//       // Calculate unpaidAmount = totalAmount - paidAmount
//       {
//         $addFields: {
//           unpaidAmount: { $subtract: ["$totalAmount", "$paidAmount"] },
//         },
//       },

//       // Expand items array
//       { $unwind: "$items" },

//       {
//         $project: {
//           _id: 0,
//           shopId: 1,
//           invoiceNo: 1,
//           createdAt: 1,
//           customerId: 1,
//           productId: "$items.productId",
//           productName: "$items.productName",
//           quantity: "$items.quantity",
//           unitPrice: "$items.unitPrice",
//           totalPrice: "$items.totalPrice",
//           unpaidAmount: 1,
//         },
//       },

//       // Now group everything together
//       {
//         $group: {
//           _id: null,
//           itemsTaken: { $push: "$$ROOT" },
//           totalOutstanding: { $sum: "$unpaidAmount" },
//           createdAt: { $first: "$createdAt" },
//         },
//       },
//     ]);

//     if (!data || data.length === 0) {
//       return res
//         .status(200)
//         .json(
//           new ApiResponse(
//             200,
//             { itemsTaken: [], totalOutstanding: 0 },
//             "No sales found",
//           ),
//         );
//     }

//     return res
//       .status(200)
//       .json(
//         new ApiResponse(
//           200,
//           data[0],
//           "Customer outstanding fetched successfully",
//         ),
//       );
//   },
// );

export {
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
  getCustomerOutstanding
};
