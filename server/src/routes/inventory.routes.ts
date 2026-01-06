import { Router } from 'express'
import {
  createInventory,
  getInventory,
  getInventoryById,
  updateInventory,
  deleteInventory
} from '../controllers/inventory.controllers.ts'
import { verifyBusinessAuth } from '../middlewares/auth.middlewares.ts'

const router = Router()
router.use(verifyBusinessAuth)

// CREATE OR UPDATE INVENTORY
router.post('/', createInventory)

// GET ALL INVENTORY
router.get('/', getInventory)

// GET SINGLE INVENTORY BY ID
router.get('/:id', getInventoryById)

// UPDATE INVENTORY
router.put('/:id', updateInventory)

// DELETE INVENTORY
router.delete('/:id', deleteInventory)

export default router
