import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import mongoose from 'mongoose'
import Sales from '../models/sales.models.ts'
import Product from '../models/product.models.ts'
import Inventory from '../models/inventory.models.ts'
import Customer from '../models/customer.models.ts'

type SaleItemInput = {
  productId: string
  productName?: string
  quantity: number
  unitPrice?: number
  totalPrice?: number
}

const createSale = asyncHandler(async (req: Request, res: Response) => {
  const { customerId, shopId, items, totalAmount, paidAmount = 0, invoiceNo, clientId } = req.body;

  // --- VALIDATIONS ---
  const requiredFields = ["customerId", "shopId", "items", "totalAmount", "invoiceNo"] as const;
  for (const field of requiredFields) {
    if (!req.body[field]) throw new ApiError(400, `Missing required field: ${field}`);
  }

  if (!Array.isArray(items) || items.length === 0)
    throw new ApiError(400, "Items must be a non-empty array");

  const requiredItemFields = ["productId", "productName", "quantity", "unitPrice", "totalPrice"] as const;
  items.forEach((item: any, i: number) => {
    if (!item || typeof item !== "object") throw new ApiError(400, `Item at index ${i} must be an object`);
    requiredItemFields.forEach((field) => {
      if (!item[field] && item[field] !== 0)
        throw new ApiError(400, `Missing required field in items[${i}]: ${field}`);
    });
  });

  // -------------------------------------------------------
  // 1️⃣ CUSTOMER MUST EXIST
  // -------------------------------------------------------
  const customer = await Customer.findById(customerId);
  if (!customer) throw new ApiError(404, "Customer not found");

  // -------------------------------------------------------
  // 2️⃣ UPDATE INVENTORY (DECREASE STOCK)
  // -------------------------------------------------------
  for (const item of items) {
    const productInv = await Inventory.findOne({productId: item.productId, shopId});
    if (!productInv) throw new ApiError(404, `Product not found: ${item.productName}`);

    if (productInv.stock < item.quantity)
      throw new ApiError(400, `Not enough stock for ${item.productName}`);

      productInv.stock -= item.quantity;
      await productInv.save();
  }

  // -------------------------------------------------------
  // 3️⃣ CREATE SALE
  // -------------------------------------------------------
  const sale = await Sales.create({
    customerId,
    shopId,
    items,
    totalAmount,
    paidAmount,
    clientId,
    invoiceNo,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, sale, "Sale created successfully"));
});

// GET ALL SALES
const getSales = asyncHandler(async (req: Request, res: Response) => {
  const { shopId } = req.query
  const filter: any = {}

  if (shopId) filter.shopId = shopId

  const sales = await Sales.find(filter)
  return res.status(200).json(new ApiResponse(200, sales, 'Sales fetched'))
})

// GET SINGLE SALE
const getSale = asyncHandler(async (req: Request, res: Response) => {
  const sale = await Sales.findById(req.params.id)
  if (!sale) throw new ApiError(404, 'Sale not found')

  return res.status(200).json(new ApiResponse(200, sale, 'Sale fetched'))
})

// UPDATE SALE
const updateSale = asyncHandler(async (req: Request, res: Response) => {
  const saleId = req.params.id;
  const updates = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch old sale
    const oldSale = await Sales.findById(saleId).session(session);
    if (!oldSale) throw new ApiError(404, "Sale not found");

    const shopId = oldSale.shopId;

    const oldItemsMap = new Map();
    oldSale.items.forEach((it: any) => {
      oldItemsMap.set(it.productId.toString(), it.quantity);
    });

    const newItems = updates.items || [];
    const newItemsMap = new Map();
    newItems.forEach((it: any) => {
      newItemsMap.set(it.productId.toString(), it.quantity);
    });

    // 2. Handle item quantity updates
    for (const [productId, newQty] of newItemsMap.entries()) {
      const oldQty = oldItemsMap.get(productId) || 0;

      const difference = newQty - oldQty;

      if (difference === 0) continue;

      // If new quantity is greater → reduce stock
      if (difference > 0) {
        const updatedInv = await Inventory.findOneAndUpdate(
          {
            productId,
            shopId,
            stock: { $gte: difference }
          },
          {
            $inc: { stock: -difference }
          },
          { new: true, session }
        );

        if (!updatedInv) {
          throw new ApiError(
            400,
            `Not enough stock for product ${productId}. Need ${difference}.`
          );
        }
      }

      // If new quantity is smaller → restore stock
      if (difference < 0) {
        await Inventory.findOneAndUpdate(
          { productId, shopId },
          { $inc: { stock: Math.abs(difference) } },
          { new: true, session }
        );
      }
    }

    // 3. If an item was removed entirely → restore its full quantity
    for (const [productId, oldQty] of oldItemsMap.entries()) {
      if (!newItemsMap.has(productId)) {

        await Inventory.findOneAndUpdate(
          { productId, shopId },
          { $inc: { stock: oldQty } },
          { new: true, session }
        );
      }
    }

    
    // 4. Update sale document
    updates.totalAmount = updates.items?.reduce((sum: number, item: any) => sum + item.totalPrice, 0) ?? updates.totalAmount;

    const updatedSale = await Sales.findByIdAndUpdate(
      saleId,
      { $set: updates },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return res
      .status(200)
      .json(new ApiResponse(200, updatedSale, "Sale updated successfully"));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});


// DELETE SALE
const deleteSale = asyncHandler(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const saleId = req.params.id;

    // 1. Find the sale
    const sale = await Sales.findById(saleId).session(session);
    if (!sale) throw new ApiError(404, "Sale not found");

    const { items, shopId, customerId, totalAmount, paidAmount } = sale;
    const unpaidAmount = totalAmount - paidAmount;

    // 2. Restore inventory for each item
    for (const item of items) {
      const { productId, quantity } = item;

      await Inventory.findOneAndUpdate(
        { shopId, productId },
        { $inc: { stock: quantity } }, // restore
        { session }
      );
    }

    // 3. Restore customer outstanding balance
    if (customerId) {
      await Customer.findByIdAndUpdate(
        customerId,
        { $inc: { outstandingBalance: -unpaidAmount } },
        { session }
      );
    }

    // 4. Delete the sale
    await Sales.findByIdAndDelete(saleId).session(session);

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "Sale deleted and inventory/customer balance restored"
      )
    );
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, "Failed to delete sale with restoration");
  }
});


export {
  createSale,
  getSales,
  getSale,
  updateSale,
  deleteSale
}
