import { Router } from 'express'
import {
  createExpense,
  getExpenses,
  getExpense,
  updateExpense,
  deleteExpense
} from '../controllers/expense.controllers.ts'

const router = Router()

// CREATE EXPENSE
router.post('/', createExpense)

// GET ALL EXPENSES
router.get('/', getExpenses)

// GET SINGLE EXPENSE
router.get('/:id', getExpense)

// UPDATE EXPENSE
router.put('/:id', updateExpense)

// DELETE EXPENSE (soft delete)
router.delete('/:id', deleteExpense)

export default router
