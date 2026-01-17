import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiError } from '../utils/ApiError.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import Product from '../models/product.models.ts';
import Inventory from '../models/inventory.models.ts';
import Supplier from '../models/supplier.models.ts';
import Category from '../models/category.models.ts';
import mongoose from 'mongoose';

const checkSkuAvailability = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user?.activeShopId;
  const { sku, excludeProductId } = req.query;

  if (!sku || typeof sku !== 'string') {
    throw new ApiError(400, 'SKU is required');
  }

  const query: any = {
    shopId: new mongoose.Types.ObjectId(shopId),
    sku,
    deleted: false,
  };

  // When editing a product, exclude itself
  if (excludeProductId) {
    query._id = { $ne: excludeProductId };
  }

  const exists = await Product.exists(query);

  return res.status(200).json(
    new ApiResponse(200, {
      available: !exists,
    })
  );
});

const generateSku = async (req, res) => {
  try {
    const { name, category, excludeProductId } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category required' });
    }

    const namePart =
      name
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 4) || 'ITEM';

    const categoryPart = category.toUpperCase().slice(0, 3) || 'GEN';

    const baseSku = `${categoryPart}-${namePart}`;

    let counter = 1000;
    let sku;

    while (true) {
      sku = `${baseSku}-${counter}`;

      const query = { sku, deleted: false };

      if (excludeProductId) {
        query._id = { $ne: excludeProductId };
      }

      const exists = await Product.exists(query);

      if (!exists) break;

      counter++;
    }

    res.json({ sku });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate SKU' });
  }
};

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const {
    name,
    sku,
    category, // make this categoryId later
    description,
    stock = 0,
    minStock,
    price,
    cost,
    supplier, // make this supplierId later
  } = req.body;

  // change category->categoryId and supplier-> supplierId
  const reqFields = ['name', 'sku', 'category', 'price'];

  reqFields.forEach((field) => {
    if (!req.body[field]) {
      throw new ApiError(401, `The ${field} field is required.`);
    }
  });

  if (!sku || !name) {
    throw new ApiError(400, 'sku and name are required');
  }

  const existing = await Product.findOne({
    shopId: new mongoose.Types.ObjectId(shopId),
    sku,
    deleted: false,
  });
  if (existing) throw new ApiError(400, 'Product with same SKU already exists for this shop');

  const supplierId = (await Supplier.findOne({ name: supplier })?._id) || null;

  const categoryId = await Category.findOne({ name: category });

  if (!categoryId) {
    throw new ApiError(404, `The category by the name ${category} was not found`);
  }

  if (supplier && !supplierId) {
    throw new ApiError(404, `The supplier by the name ${supplier} was not found`);
  }

  const product = await Product.create({
    shopId,
    supplierId,
    categoryId,
    sku,
    name,
    description: description || '',
    price: price ?? 0,
    cost: cost ?? 0,
  });

  if (!product) {
    throw new ApiError(500, 'Something went wrong creating the product');
  }

  try {
    await Inventory.create({
      shopId,
      productId: product._id,
      stock,
      minStock,
    });
  } catch (err) {
    await Product.findByIdAndDelete(product?._id);
    throw new ApiError(500, err?.message || 'Something went wrong creating inventory');
  }

  return res.status(201).json(new ApiResponse(201, product, 'Product was created!'));
});

// Get all products for the active shop
const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;

  const products = await Product.aggregate([
    // 1️⃣ Filter by shop + not deleted
    {
      $match: {
        shopId: new mongoose.Types.ObjectId(shopId),
        deleted: false,
      },
    },

    // 2️⃣ Join inventory
    {
      $lookup: {
        from: 'inventories',
        localField: '_id',
        foreignField: 'productId',
        as: 'inventory',
      },
    },

    // 3️⃣ Flatten inventory (1 product → 1 inventory)
    {
      $unwind: {
        path: '$inventory',
        preserveNullAndEmptyArrays: true,
      },
    },

    // 4️⃣ Add computed fields
    {
      $addFields: {
        stock: { $ifNull: ['$inventory.stock', 0] },
        reserved: { $ifNull: ['$inventory.reserved', 0] },
        availableStock: {
          $subtract: [
            { $ifNull: ['$inventory.stock', 0] },
            { $ifNull: ['$inventory.reserved', 0] },
          ],
        },
        isLowStock: {
          $lte: [
            {
              $subtract: [
                { $ifNull: ['$inventory.stock', 0] },
                { $ifNull: ['$inventory.reserved', 0] },
              ],
            },
            '$reorderLevel',
          ],
        },
      },
    },

    // 5️⃣ Cleanup
    {
      $project: {
        inventory: 0,
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, products, 'Products fetched'));
});

const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const product = await Product.findOne({
    _id: req.params.id,
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false,
  });
  if (!product) throw new ApiError(404, 'Product not found');
  return res.status(200).json(new ApiResponse(200, product, 'Product fetched'));
});

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const updates = { ...req.body };
  delete updates._id;
  delete updates.shopId; // Prevent changing shopId

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, shopId: new mongoose.Types.ObjectId(shopId), deleted: false },
    { $set: updates },
    { new: true }
  );
  if (!product) throw new ApiError(404, 'Product not found');
  return res.status(200).json(new ApiResponse(200, product, 'Product updated'));
});

const softDeleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, shopId: new mongoose.Types.ObjectId(shopId), deleted: false },
    { $set: { deleted: true } },
    { new: true }
  );
  if (!product) throw new ApiError(404, 'Product not found');
  return res.status(200).json(new ApiResponse(200, product, 'Product soft-deleted'));
});

export { 
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  softDeleteProduct,
  generateSku,
  checkSkuAvailability
};
