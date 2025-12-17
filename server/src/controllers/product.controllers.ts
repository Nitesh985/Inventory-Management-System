import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import Product from '../models/product.models.ts'
import Shop from '../models/shop.models.ts'
import mongoose from 'mongoose'

const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { shopId, clientId, sku, name, category, unit, price, cost, reorderLevel } = req.body

  if (!shopId || !clientId || !sku || !name) {
    throw new ApiError(400, 'shopId, clientId, sku and name are required')
  }

  const shopExists = await Shop.findById(shopId)
  if (!shopExists) throw new ApiError(400, 'Shop not found')

  const existing = await Product.findOne({ shopId, sku })
  if (existing) throw new ApiError(400, 'Product with same SKU already exists for this shop')

  const product = await Product.create({
    shopId,
    clientId,
    sku,
    name,
    category: category || '',
    unit: unit ?? 1,
    price: price ?? 0,
    cost: cost ?? 0,
    reorderLevel: reorderLevel ?? 0,
    deleted: false
  })

  return res.status(201).json(new ApiResponse(201, product, 'Product created'))
})

const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const { shopId } = req.query
  const filter: any = {}
  if (shopId) filter.shopId = shopId
  filter.deleted = false
  // Get the stock as well
  const products = await Product.find(filter)
  return res.status(200).json(new ApiResponse(200, products, 'Products fetched'))
})

const getProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
  if (!product || product.deleted) throw new ApiError(404, 'Product not found')
  return res.status(200).json(new ApiResponse(200, product, 'Product fetched'))
})

const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const updates = { ...req.body }
  delete updates._id
  const product = await Product.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true })
  if (!product) throw new ApiError(404, 'Product not found')
  return res.status(200).json(new ApiResponse(200, product, 'Product updated'))
})

const softDeleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { $set: { deleted: true } }, { new: true })
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