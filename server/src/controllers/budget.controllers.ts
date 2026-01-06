import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import Budget from '../models/budget.models.ts'
import mongoose from 'mongoose'

// Create a new budget
const createBudget = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const { category, categoryName, limit, period } = req.body

  if (!category || !categoryName || typeof limit !== 'number') {
    throw new ApiError(400, 'category, categoryName, and numeric limit are required')
  }

  // Check if budget for this category already exists
  const existing = await Budget.findOne({
    shopId: new mongoose.Types.ObjectId(shopId),
    category,
    deleted: false
  })

  if (existing) {
    throw new ApiError(400, 'Budget for this category already exists. Use update instead.')
  }

  const budget = await Budget.create({
    shopId: new mongoose.Types.ObjectId(shopId),
    category,
    categoryName,
    limit,
    period: period || 'monthly',
    deleted: false
  })

  return res.status(201).json(new ApiResponse(201, budget, 'Budget created successfully'))
})

// Get all budgets for the shop
const getBudgets = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!

  const budgets = await Budget.find({
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false
  }).sort({ categoryName: 1 })

  return res.status(200).json(new ApiResponse(200, budgets, 'Budgets fetched'))
})

// Get single budget by ID
const getBudget = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!

  const budget = await Budget.findOne({
    _id: req.params.id,
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false
  })

  if (!budget) throw new ApiError(404, 'Budget not found')

  return res.status(200).json(new ApiResponse(200, budget, 'Budget fetched'))
})

// Update budget
const updateBudget = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const updates = { ...req.body }
  
  // Prevent changing these fields
  delete updates._id
  delete updates.shopId
  delete updates.category // Category shouldn't change, create new instead

  const updated = await Budget.findOneAndUpdate(
    {
      _id: req.params.id,
      shopId: new mongoose.Types.ObjectId(shopId),
      deleted: false
    },
    { $set: updates },
    { new: true }
  )

  if (!updated) throw new ApiError(404, 'Budget not found')

  return res.status(200).json(new ApiResponse(200, updated, 'Budget updated'))
})

// Delete budget (soft delete)
const deleteBudget = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!

  const deleted = await Budget.findOneAndUpdate(
    {
      _id: req.params.id,
      shopId: new mongoose.Types.ObjectId(shopId),
      deleted: false
    },
    { $set: { deleted: true } },
    { new: true }
  )

  if (!deleted) throw new ApiError(404, 'Budget not found')

  return res.status(200).json(new ApiResponse(200, deleted, 'Budget deleted'))
})

// Upsert budget (create or update)
const upsertBudget = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const { category, categoryName, limit, period } = req.body

  if (!category || !categoryName || typeof limit !== 'number') {
    throw new ApiError(400, 'category, categoryName, and numeric limit are required')
  }

  const budget = await Budget.findOneAndUpdate(
    {
      shopId: new mongoose.Types.ObjectId(shopId),
      category,
      deleted: false
    },
    {
      $set: {
        categoryName,
        limit,
        period: period || 'monthly'
      },
      $setOnInsert: {
        shopId: new mongoose.Types.ObjectId(shopId),
        category,
        deleted: false
      }
    },
    { new: true, upsert: true }
  )

  return res.status(200).json(new ApiResponse(200, budget, 'Budget saved'))
})

export {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget,
  upsertBudget
}
