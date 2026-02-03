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


  const product = await Product.create({
    shopId,
    supplier,
    category,
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

// Bulk import products
const bulkImportProducts = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!;
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    throw new ApiError(400, 'Products array is required and must not be empty');
  }

  const results = {
    total: products.length,
    successful: 0,
    failed: 0,
    errors: [] as Array<{ row: number; error: string }>
  };

  // Process each product
  for (let i = 0; i < products.length; i++) {
    const productData = products[i];
    const rowNumber = i + 2; // +2 because: +1 for array index, +1 for CSV header

    try {
      // Validate required fields
      if (!productData.name || !productData.sku) {
        results.errors.push({
          row: rowNumber,
          error: 'Missing required fields: name and sku are required'
        });
        results.failed++;
        continue;
      }

      // Check if SKU already exists
      const existing = await Product.findOne({
        shopId: new mongoose.Types.ObjectId(shopId),
        sku: productData.sku,
        deleted: false,
      });

      if (existing) {
        results.errors.push({
          row: rowNumber,
          error: `Duplicate SKU: ${productData.sku} already exists`
        });
        results.failed++;
        continue;
      }

      // Validate numbers
      const price = parseFloat(productData.price) || 0;
      const cost = parseFloat(productData.cost) || 0;
      const stock = parseInt(productData.stock) || 0;
      const minStock = parseInt(productData.minStock) || 0;

      if (price < 0 || cost < 0) {
        results.errors.push({
          row: rowNumber,
          error: 'Price and cost must be positive numbers'
        });
        results.failed++;
        continue;
      }

      // Create product
      const product = await Product.create({
        shopId: new mongoose.Types.ObjectId(shopId),
        sku: productData.sku,
        name: productData.name,
        category: productData.category || 'General',
        description: productData.description || '',
        price,
        cost,
      });

      // Create inventory
      await Inventory.create({
        shopId: new mongoose.Types.ObjectId(shopId),
        productId: product._id,
        stock,
        minStock,
      });

      results.successful++;
    } catch (err: any) {
      results.errors.push({
        row: rowNumber,
        error: err.message || 'Unknown error occurred'
      });
      results.failed++;
    }
  }

  return res.status(200).json(
    new ApiResponse(200, results, 'Bulk import completed')
  );
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
        minStock: { $ifNull: ['$inventory.minStock', 0] },
        availableStock: { $ifNull: ['$inventory.stock', 0] },
        isLowStock: {
          $lte: [
            { $ifNull: ['$inventory.stock', 0] },
            { $ifNull: ['$inventory.minStock', 0] },
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

  const { minStock } = req.body
  console.log("Min STock")
  console.log(minStock)

  // Map frontend field names to backend field names FIRST
  if (updates.unitPrice !== undefined) {
    updates.price = updates.unitPrice;
    delete updates.unitPrice;
  }
  if (updates.costPrice !== undefined) {
    updates.cost = updates.costPrice;
    delete updates.costPrice;
  }

  // Separate inventory fields from product fields
  const inventoryFields = ['stock', 'minStock'];
  const inventoryUpdates: any = {}; 
  const productUpdates: any = {};

  Object.keys(updates).forEach(key => {
    if (inventoryFields.includes(key)) {
      inventoryUpdates[key] = updates[key];
    } else {
      productUpdates[key] = updates[key];
    }
  });

  // Update product
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, shopId: new mongoose.Types.ObjectId(shopId), deleted: false },
    { $set: productUpdates },
    { new: true }
  );
  if (!product) throw new ApiError(404, 'Product not found');

  if (minStock){
    inventoryUpdates['minStock'] = minStock
  }

  // Update inventory if inventory fields are provided
  if (Object.keys(inventoryUpdates).length > 0) {
    await Inventory.findOneAndUpdate(
      { productId: product._id, shopId: new mongoose.Types.ObjectId(shopId) },
      { $set: inventoryUpdates },
      { new: true }
    );
  }

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
  bulkImportProducts,
  getProducts,
  getProduct,
  updateProduct,
  softDeleteProduct,
  generateSku,
  checkSkuAvailability
};
