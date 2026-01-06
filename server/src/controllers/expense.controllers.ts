import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import  Expense  from '../models/expense.models.ts'
import mongoose from 'mongoose'

const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const clientId = req.user!.id
  const { description, amount, date, category } = req.body
  
  if (!description || typeof amount !== 'number') {
    throw new ApiError(400, 'description and numeric amount are required')
  }

  const expense = await Expense.create({
    shopId: new mongoose.Types.ObjectId(shopId),
    clientId,
    description,
    amount,
    date: date ? new Date(date) : new Date(),
    category: category || '',
    deleted: false
  })

  return res.status(201).json(new ApiResponse(201,  expense, "Expense Created!"))
})

const getExpenses = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const { from, to } = req.query
  
  const filter: any = { 
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false 
  }
  
  if (from || to) filter.date = {}
  if (from) filter.date.$gte = new Date(String(from))
  if (to) filter.date.$lte = new Date(String(to))
  
  const expenses = await Expense.find(filter)
  return res.status(200).json(new ApiResponse(200, expenses, 'Expenses fetched'))
})

const getExpense = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const item = await Expense.findOne({
    _id: req.params.id,
    shopId: new mongoose.Types.ObjectId(shopId),
    deleted: false
  })
  if (!item) throw new ApiError(404, 'Expense not found')
  return res.status(200).json(new ApiResponse(200, item, 'Expense fetched'))
})

const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  const updates = { ...req.body }
  delete updates._id
  delete updates.shopId // Prevent changing shopId
  delete updates.clientId // Prevent changing clientId
  
  const updated = await Expense.findOneAndUpdate(
    { _id: req.params.id, shopId: new mongoose.Types.ObjectId(shopId), deleted: false },
    { $set: updates },
    { new: true }
  )
  if (!updated) throw new ApiError(404, 'Expense not found')
  return res.status(200).json(new ApiResponse(200, updated, 'Expense updated'))
})

const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.user!.activeShopId!
  // soft delete
  const deleted = await Expense.findOneAndUpdate(
    { _id: req.params.id, shopId: new mongoose.Types.ObjectId(shopId), deleted: false },
    { $set: { deleted: true } },
    { new: true }
  )
  if (!deleted) throw new ApiError(404, 'Expense not found')
  return res.status(200).json(new ApiResponse(200, deleted, 'Expense deleted'))
})

export {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense
}