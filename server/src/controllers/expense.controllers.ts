import type { Request, Response } from 'express'
import { asyncHandler } from '../utils/asyncHandler.ts'
import { ApiError } from '../utils/ApiError.ts'
import { ApiResponse } from '../utils/ApiResponse.ts'
import  Expense  from '../models/expense.models.ts'

const createExpense = asyncHandler(async (req: Request, res: Response) => {
  const { shopId, clientId, description, amount, date, category } = req.body
  if (!shopId || !clientId || !description || typeof amount !== 'number') {
    throw new ApiError(400, 'shopId, clientId, description and numeric amount are required')
  }

  const expense = await Expense.create({
    shopId,
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
  const { shopId, clientId, from, to } = req.query
  const filter: any = { deleted: false }
  if (shopId) filter.shopId = shopId
  if (clientId) filter.clientId = clientId
  if (from || to) filter.date = {}
  if (from) filter.date.$gte = new Date(String(from))
  if (to) filter.date.$lte = new Date(String(to))
  const expenses = await Expense.find(filter)
  return res.status(200).json(new ApiResponse(200, expenses, 'Expenses fetched'))
})

const getExpense = asyncHandler(async (req: Request, res: Response) => {
  const item = await Expense.findById(req.params.id)
  if (!item) throw new ApiError(404, 'Expense not found')
  return res.status(200).json(new ApiResponse(200, item, 'Expense fetched'))
})

const updateExpense = asyncHandler(async (req: Request, res: Response) => {
  const updates = { ...req.body }
  delete updates._id
  const updated = await Expense.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true })
  if (!updated) throw new ApiError(404, 'Expense not found')
  return res.status(200).json(new ApiResponse(200, updated, 'Expense updated'))
})

const deleteExpense = asyncHandler(async (req: Request, res: Response) => {
  // soft delete
  const deleted = await Expense.findByIdAndUpdate(req.params.id, { $set: { deleted: true } }, { new: true })
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