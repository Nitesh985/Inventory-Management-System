import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiError } from '../utils/ApiError.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import mongoose from 'mongoose';
import Sales from '../models/sales.models.ts';
import Product from '../models/product.models.ts';
import Inventory from '../models/inventory.models.ts';
import Customer from '../models/customer.models.ts';

type SaleItemInput = {
  productId: string;
  productName?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
};

const createSale = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const {
    customerId,
    items,
    totalAmount,
    paidAmount = 0,
    paymentMethod = 'CASH',
    discount = 0,
    notes,
  } = req.body;

  // --- VALIDATIONS ---
  const requiredFields = ['customerId', 'items', 'totalAmount'] as const;
  for (const field of requiredFields) {
    if (!req.body[field]) throw new ApiError(400, `Missing required field: ${field}`);
  }

  if (!Array.isArray(items) || items.length === 0)
    throw new ApiError(400, 'Items must be a non-empty array');

  const requiredItemFields = ['productId', 'productName', 'quantity'] as const;
  items.forEach((item: any, i: number) => {
    if (!item || typeof item !== 'object')
      throw new ApiError(400, `Item at index ${i} must be an object`);
    requiredItemFields.forEach((field) => {
      if (!item[field] && item[field] !== 0)
        throw new ApiError(400, `Missing required field in items[${i}]: ${field}`);
    });

    // Ensure unitPrice and totalPrice are provided or calculated
    if (!item.unitPrice && item.unitPrice !== 0) {
      throw new ApiError(400, `Missing unitPrice in items[${i}]`);
    }
    if (!item.totalPrice && item.totalPrice !== 0) {
      throw new ApiError(400, `Missing totalPrice in items[${i}]`);
    }
  });

  // -------------------------------------------------------
  // 0️⃣ AUTO-GENERATE UNIQUE INVOICE NUMBER
  // -------------------------------------------------------
  // Find the latest invoice for this shop to get next counter
  const latestSale = await Sales.findOne(
    { shopId: new mongoose.Types.ObjectId(shopId) },
    {},
    { sort: { createdAt: -1 } }
  );

  let invoiceCounter = 1;
  if (latestSale?.invoiceNo) {
    // Extract counter from last invoice (format: INV-XXXX-NNNNN)
    const lastCounter = parseInt(latestSale.invoiceNo.split('-')[2]) || 0;
    invoiceCounter = lastCounter + 1;
  }

  const shopIdStr = shopId.toString().slice(-4);
  const invoiceNo = `INV-${shopIdStr}-${String(invoiceCounter).padStart(5, '0')}`;

  // -------------------------------------------------------
  // 1️⃣ HANDLE CUSTOMER - CREATE WALK-IN IF NEEDED
  // -------------------------------------------------------
  let finalCustomerId = customerId;
  
  // If customerId is 'walk-in' or similar, find or create a default walk-in customer
  if (!customerId || customerId === 'walk-in' || customerId.toLowerCase().includes('walk')) {
    // Try to find existing walk-in customer for this shop
    let walkInCustomer = await Customer.findOne({
      shopId: new mongoose.Types.ObjectId(shopId),
      name: { $regex: /^walk-?in/i },
      deleted: false
    });
    
    // If not found, create one
    if (!walkInCustomer) {
      walkInCustomer = await Customer.create({
        shopId: new mongoose.Types.ObjectId(shopId),
        name: 'Walk-in Customer',
        contact: [],
        address: '',
        notes: 'Default walk-in customer',
        deleted: false
      });
    }
    
    finalCustomerId = walkInCustomer._id.toString();
  }
  
  // Verify the customer exists and belongs to shop
  const customer = await Customer.findOne({
    _id: finalCustomerId,
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false,
  });
  if (!customer) throw new ApiError(404, 'Customer not found');

  // -------------------------------------------------------
  // 2️⃣ UPDATE INVENTORY (DECREASE STOCK)
  // -------------------------------------------------------
  for (const item of items) {
    const productInv = await Inventory.findOne({
      productId: new mongoose.Types.ObjectId(item.productId),
      shopId: new mongoose.Types.ObjectId(shopId),
    });
    if (!productInv) throw new ApiError(404, `Product not found: ${item.productName}`);

    if (productInv.stock < item.quantity)
      throw new ApiError(400, `Not enough stock for ${item.productName}`);

    productInv.stock -= item.quantity;
    await productInv.save();
  }

  // -------------------------------------------------------
  // 3️⃣ CREATE SALE
  // -------------------------------------------------------
  // Auto-set status to PENDING if payment method is CREDIT
  const status = paymentMethod === 'CREDIT' ? 'PENDING' : 'COMPLETED';

  // Ensure items have proper structure for database
  const formattedItems = items.map((item: any) => ({
    productId: new mongoose.Types.ObjectId(item.productId),
    productName: item.productName,
    quantity: Number(item.quantity),
    unitPrice: Number(item.unitPrice),
    totalPrice: Number(item.totalPrice),
  }));

  const sale = await Sales.create({
    customerId: new mongoose.Types.ObjectId(finalCustomerId),
    shopId: new mongoose.Types.ObjectId(shopId),
    items: formattedItems,
    totalAmount,
    paidAmount,
    paymentMethod,
    discount,
    notes,
    status,
    invoiceNo,
  });

  return res.status(201).json(new ApiResponse(201, sale, 'Sale created successfully'));
});

// GET ALL SALES WITH FILTERING
const getSales = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const { search, paymentMethod, startDate, endDate } = req.query;

  // Build filter object
  const filter: any = { shopId: new mongoose.Types.ObjectId(shopId) };

  // Search by invoice number or customer name
  if (search) {
    filter.$or = [{ invoiceNo: { $regex: search, $options: 'i' } }];
  }

  // Filter by payment method
  if (paymentMethod && paymentMethod !== '') {
    filter.paymentMethod = paymentMethod;
  }

  // Filter by date range
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate as string);
    }
    if (endDate) {
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
      filter.createdAt.$lte = end;
    }
  }

  const sales = await Sales.find(filter)
    .populate('customerId', 'name phone email')
    .sort({ createdAt: -1 });

  // Transform response to include customerName and properly formatted items
  const transformedSales = sales.map((sale: any) => ({
    _id: sale._id,
    invoiceNo: sale.invoiceNo,
    customerId: sale.customerId?._id,
    customerName: sale.customerId?.name || 'Walk-in',
    customerPhone: sale.customerId?.phone || '',
    customerEmail: sale.customerId?.email || '',
    items: sale.items.map((item: any) => ({
      productId: item.productId,
      name: item.productName,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.totalPrice,
      totalPrice: item.totalPrice,
    })),
    paymentMethod: sale.paymentMethod,
    totalAmount: sale.totalAmount,
    paidAmount: sale.paidAmount,
    discount: sale.discount || 0,
    notes: sale.notes || '',
    status: sale.status,
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  }));

  return res.status(200).json(new ApiResponse(200, transformedSales, 'Sales fetched'));
});

// GET SINGLE SALE
const getSale = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const sale = await Sales.findOne({
    _id: req.params.id,
    shopId: new mongoose.Types.ObjectId(shopId),
  }).populate('customerId', 'name phone email');

  if (!sale) throw new ApiError(404, 'Sale not found');

  // Transform response to include customerName and properly formatted items
  const transformedSale = {
    _id: sale._id,
    invoiceNo: sale.invoiceNo,
    customerId: (sale.customerId as any)?._id,
    customerName: (sale.customerId as any)?.name || 'Walk-in',
    customerPhone: (sale.customerId as any)?.phone || '',
    customerEmail: (sale.customerId as any)?.email || '',
    items: sale.items.map((item: any) => ({
      productId: item.productId,
      name: item.productName,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.totalPrice,
      totalPrice: item.totalPrice,
    })),
    paymentMethod: sale.paymentMethod,
    totalAmount: sale.totalAmount,
    paidAmount: sale.paidAmount,
    discount: sale.discount || 0,
    notes: sale.notes || '',
    status: sale.status,
    createdAt: sale.createdAt,
    updatedAt: sale.updatedAt,
  };

  return res.status(200).json(new ApiResponse(200, transformedSale, 'Sale fetched'));
});

// UPDATE SALE
const updateSale = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const saleId = req.params.id;
  const updates = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch old sale - verify it belongs to this shop
    const oldSale = await Sales.findOne({
      _id: saleId,
      shopId: new mongoose.Types.ObjectId(shopId),
    }).session(session);
    if (!oldSale) throw new ApiError(404, 'Sale not found');

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
            productId: new mongoose.Types.ObjectId(productId),
            shopId: new mongoose.Types.ObjectId(shopId),
            stock: { $gte: difference },
          },
          {
            $inc: { stock: -difference },
          },
          { new: true, session }
        );

        if (!updatedInv) {
          throw new ApiError(400, `Not enough stock for product ${productId}. Need ${difference}.`);
        }
      }

      // If new quantity is smaller → restore stock
      if (difference < 0) {
        await Inventory.findOneAndUpdate(
          {
            productId: new mongoose.Types.ObjectId(productId),
            shopId: new mongoose.Types.ObjectId(shopId),
          },
          { $inc: { stock: Math.abs(difference) } },
          { new: true, session }
        );
      }
    }

    // 3. If an item was removed entirely → restore its full quantity
    for (const [productId, oldQty] of oldItemsMap.entries()) {
      if (!newItemsMap.has(productId)) {
        await Inventory.findOneAndUpdate(
          {
            productId: new mongoose.Types.ObjectId(productId),
            shopId: new mongoose.Types.ObjectId(shopId),
          },
          { $inc: { stock: oldQty } },
          { new: true, session }
        );
      }
    }

    // 4. Update sale document
    updates.totalAmount =
      updates.items?.reduce((sum: number, item: any) => sum + item.totalPrice, 0) ??
      updates.totalAmount;
    delete updates.shopId; // Prevent changing shopId

    const updatedSale = await Sales.findByIdAndUpdate(
      saleId,
      { $set: updates },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    return res.status(200).json(new ApiResponse(200, updatedSale, 'Sale updated successfully'));
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

// DELETE SALE
const deleteSale = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const saleId = req.params.id;

    // 1. Find the sale - verify it belongs to this shop
    const sale = await Sales.findOne({
      _id: saleId,
      shopId: new mongoose.Types.ObjectId(shopId),
    }).session(session);
    if (!sale) throw new ApiError(404, 'Sale not found');

    const { items, customerId, totalAmount, paidAmount } = sale;
    const unpaidAmount = totalAmount - paidAmount;

    // 2. Restore inventory for each item
    for (const item of items) {
      const { productId, quantity } = item;

      await Inventory.findOneAndUpdate(
        {
          shopId: new mongoose.Types.ObjectId(shopId),
          productId: new mongoose.Types.ObjectId(productId),
        },
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

    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Sale deleted and inventory/customer balance restored'));
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(500, 'Failed to delete sale with restoration');
  }
});

export { createSale, getSales, getSale, updateSale, deleteSale };
