import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import Inventory from '../models/inventory.models.ts'
import Product from '../models/product.models.ts'
import mongoose from 'mongoose'

const createInventory = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const { productId, stock, reserved } = req.body

  if (!productId) throw new ApiError(400, 'productId required')

  // Verify product exists and belongs to the same shop
  const product = await Product.findOne({
    _id: productId,
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false
  })
  if (!product) throw new ApiError(400, 'Product not found or does not belong to this shop')

  const existing = await Inventory.findOne({ 
    shopId: new mongoose.Types.ObjectId(shopId), 
    productId: new mongoose.Types.ObjectId(productId) 
  })
  
  if (existing) {
    // update existing
    existing.stock = (stock ?? existing.stock)
    existing.reserved = (reserved ?? existing.reserved)
    await existing.save()
    return res.status(200).json(new ApiResponse(200, existing, 'Inventory updated'))
  }

  const inventory = await Inventory.create({
    shopId: new mongoose.Types.ObjectId(shopId),
    productId: new mongoose.Types.ObjectId(productId),
    stock: stock ?? 0,
    reserved: reserved ?? 0
  })

  return res.status(201).json(new ApiResponse(201, inventory, 'Inventory created'))
})

const getInventory = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const { productId } = req.query
  
  const filter: any = { shopId: new mongoose.Types.ObjectId(shopId) }
  if (productId) filter.productId = new mongoose.Types.ObjectId(productId as string)
  
  const items = await Inventory.find(filter)
  return res.status(200).json(new ApiResponse(200, items, 'Inventory fetched'))
})

const getInventoryById = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const item = await Inventory.findOne({
    _id: req.params.id,
    shopId: new mongoose.Types.ObjectId(shopId)
  })
  if (!item) throw new ApiError(404, 'Inventory not found')
  return res.status(200).json(new ApiResponse(200, item, 'Inventory fetched'))
})

const updateInventory = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const updates = { ...req.body }
  delete updates._id
  delete updates.shopId // Prevent changing shopId

  const item = await Inventory.findOneAndUpdate(
    { _id: req.params.id, shopId: new mongoose.Types.ObjectId(shopId) },
    { $set: updates },
    { new: true }
  )
  if (!item) throw new ApiError(404, 'Inventory not found')
  return res.status(200).json(new ApiResponse(200, item, 'Inventory updated'))
})

const deleteInventory = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const result = await Inventory.findOneAndDelete({
    _id: req.params.id,
    shopId: new mongoose.Types.ObjectId(shopId)
  })
  if (!result) throw new ApiError(404, 'Inventory not found')
  return res.status(200).json(new ApiResponse(200, {}, 'Inventory deleted'))
})

export {
  createInventory,
  getInventory,
  getInventoryById,
  updateInventory,
  deleteInventory
}