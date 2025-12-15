import { Router } from 'express'
import {
  createSale,
  getSales,
  getSale,
  updateSale,
  deleteSale
} from '../controllers/sales.controllers.ts'
import { mockupData } from '../middlewares/mockup.middlewares.ts'


const router = Router()
router.use(mockupData)

// CREATE SALE
router.post('/', createSale)

// GET ALL SALES
router.get('/', getSales)

// GET SINGLE SALE
router.get('/:id', getSale)

// UPDATE SALE
router.put('/:id', updateSale)

// DELETE SALE
router.delete('/:id', deleteSale)

export default router
