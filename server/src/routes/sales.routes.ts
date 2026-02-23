import { Router } from 'express'
import {
  createSale,
  getSales,
  getSale,
  updateSale,
  deleteSale,
  generateInvoiceNo
} from '../controllers/sales.controllers.ts'
import { verifyBusinessAuth } from '../middlewares/auth.middlewares.ts'


const router = Router()
router.use(verifyBusinessAuth)

// GENERATE INVOICE NUMBER
router.get('/generate/invoiceNo', generateInvoiceNo)

// CREATE SALE
router.post('/', createSale)

// GET ALL SALES
router.get('/', getSales)

// GET SINGLE SALE
router.get('/:id', getSale)

// UPDATE SALE STATUS
router.patch('/:id/status', updateSaleStatus)

// UPDATE SALE
router.put('/:id', updateSale)

// DELETE SALE
router.delete('/:id', deleteSale)

export default router
