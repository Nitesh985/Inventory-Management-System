import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import Product from '../models/product.models.ts'
import Inventory from '../models/inventory.models.ts'
import mongoose from 'mongoose'

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const { sku, name, category, description, unit, price, cost, reorderLevel } = req.body

  if (!sku || !name) {
    throw new ApiError(400, 'sku and name are required')
  }

  const existing = await Product.findOne({ shopId: new mongoose.Types.ObjectId(shopId), sku, deleted: false })
  if (existing) throw new ApiError(400, 'Product with same SKU already exists for this shop')

  const product = await Product.create({
    shopId: new mongoose.Types.ObjectId(shopId),
    sku,
    name,
    category: category || '',
    description: description || '',
    unit: unit ?? 1,
    price: price ?? 0,
    cost: cost ?? 0,
    reorderLevel: reorderLevel ?? 0,
    deleted: false
  })
  

  return res.status(201).json(new ApiResponse(201, product, 'Product created'))
})

// Get all products for the active shop
const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!

  const products = await Product.aggregate([
    // 1️⃣ Filter by shop + not deleted
    {
      $match: {
        shopId: new mongoose.Types.ObjectId(shopId),
        deleted: false
      }
    },

    // 2️⃣ Join inventory
    {
      $lookup: {
        from: "inventories",
        localField: "_id",
        foreignField: "productId",
        as: "inventory"
      }
    },

    // 3️⃣ Flatten inventory (1 product → 1 inventory)
    {
      $unwind: {
        path: "$inventory",
        preserveNullAndEmptyArrays: true
      }
    },

    // 4️⃣ Add computed fields
    {
      $addFields: {
        stock: { $ifNull: ["$inventory.stock", 0] },
        reserved: { $ifNull: ["$inventory.reserved", 0] },
        availableStock: {
          $subtract: [
            { $ifNull: ["$inventory.stock", 0] },
            { $ifNull: ["$inventory.reserved", 0] }
          ]
        },
        isLowStock: {
          $lte: [
            {
              $subtract: [
                { $ifNull: ["$inventory.stock", 0] },
                { $ifNull: ["$inventory.reserved", 0] }
              ]
            },
            "$reorderLevel"
          ]
        }
      }
    },

    // 5️⃣ Cleanup
    {
      $project: {
        inventory: 0
      }
    }
  ])

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched"))
})


const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const product = await Product.findOne({
    _id: req.params.id,
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false
  })
  if (!product) throw new ApiError(404, 'Product not found')
  return res.status(200).json(new ApiResponse(200, product, 'Product fetched'))
})

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const updates = { ...req.body }
  delete updates._id
  delete updates.shopId // Prevent changing shopId

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, shopId: new mongoose.Types.ObjectId(shopId), deleted: false },
    { $set: updates },
    { new: true }
  )
  if (!product) throw new ApiError(404, 'Product not found')
  return res.status(200).json(new ApiResponse(200, product, 'Product updated'))
})

const softDeleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, shopId: new mongoose.Types.ObjectId(shopId), deleted: false },
    { $set: { deleted: true } },
    { new: true }
  )
  if (!product) throw new ApiError(404, 'Product not found')
  return res.status(200).json(new ApiResponse(200, product, 'Product soft-deleted'))
})


export {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  softDeleteProduct
}