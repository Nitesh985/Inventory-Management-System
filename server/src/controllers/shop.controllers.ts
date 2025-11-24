import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import Shop from '../models/shop.models.ts'
import mongoose from 'mongoose'

const createShop = asyncHandler(async (req: Request, res: Response) => {
  const { name, useBS } = req.body

  if (!name) throw new ApiError(400, 'Shop name is required')

  const existing = await Shop.findOne({ name: name.trim() })
  if (existing) throw new ApiError(400, 'Shop with this name already exists')

  const shop = await Shop.create({ name: name.trim(), useBS: !!useBS })
  
  return res.status(201).json(new ApiResponse(201, shop, 'Shop created'))
})

const getShops = asyncHandler(async (req: Request, res: Response) => {
  const shops = await Shop.find({})
  return res.status(200).json(new ApiResponse(200, shops, 'Shops fetched'))
})

const getShop = asyncHandler(async (req: Request, res: Response) => {
  const shop = await Shop.findById(req.params.id)
  if (!shop) throw new ApiError(404, 'Shop not found')
  return res.status(200).json(new ApiResponse(200, shop, 'Shop fetched'))
})

const updateShop = asyncHandler(async (req: Request, res: Response) => {
  const { name, useBS } = req.body
  const updated = await Shop.findByIdAndUpdate(
    req.params.id,
    { $set: { ...(name ? { name } : {}), ...(typeof useBS !== 'undefined' ? { useBS } : {}) } },
    { new: true }
  )
  if (!updated) throw new ApiError(404, 'Shop not found or could not be updated')
  return res.status(200).json(new ApiResponse(200, updated, 'Shop updated'))
})

const deleteShop = asyncHandler(async (req: Request, res: Response) => {
  await Shop.findByIdAndDelete(req.params.id)
  return res.status(200).json(new ApiResponse(200, {}, 'Shop deleted'))
})


export {
  createShop,
  getShops,
  getShop,
  updateShop,
  deleteShop
}