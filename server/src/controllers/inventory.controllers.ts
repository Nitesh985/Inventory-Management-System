import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import Inventory from '../models/inventory.models.ts'
import Product from '../models/product.models.ts'
import mongoose from 'mongoose'

export const createInventory = asyncHandler(async (req: Request, res: Response) => {
  const { shopId, productId, quantity, reserved } = req.body

  if (!shopId || !productId) throw new ApiError(400, 'shopId and productId required')

  const product = await Product.findById(productId)
  if (!product) throw new ApiError(400, 'Product not found')

  const existing = await Inventory.findOne({ shopId, productId })
  if (existing) {
    // update existing
    existing.quantity = (quantity ?? existing.quantity)
    existing.reserved = (reserved ?? existing.reserved)
    await existing.save()
    return res.status(200).json(new ApiResponse(200, existing, 'Inventory updated'))
  }

  const inventory = await Inventory.create({
    shopId,
    productId,
    quantity: quantity ?? 0,
    reserved: reserved ?? 0
  })

  return res.status(201).json(new ApiResponse(201, inventory, 'Inventory created'))
})

export const getInventory = asyncHandler(async (req: Request, res: Response) => {
  const { shopId, productId } = req.query
  const filter: any = {}
  if (shopId) filter.shopId = shopId
  if (productId) filter.productId = productId
  const items = await Inventory.find(filter)
  return res.status(200).json(new ApiResponse(200, items, 'Inventory fetched'))
})

export const getInventoryById = asyncHandler(async (req: Request, res: Response) => {
  const item = await Inventory.findById(req.params.id)
  if (!item) throw new ApiError(404, 'Inventory not found')
  return res.status(200).json(new ApiResponse(200, item, 'Inventory fetched'))
})

export const updateInventory = asyncHandler(async (req: Request, res: Response) => {
  const updates = { ...req.body }
  delete updates._id
  const item = await Inventory.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true })
  if (!item) throw new ApiError(404, 'Inventory not found')
  return res.status(200).json(new ApiResponse(200, item, 'Inventory updated'))
})

export const deleteInventory = asyncHandler(async (req: Request, res: Response) => {
  await Inventory.findByIdAndDelete(req.params.id)
  return res.status(200).json(new ApiResponse(200, {}, 'Inventory deleted'))
})
