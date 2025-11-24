import { Router } from 'express'
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  softDeleteProduct
} from '../controllers/product.controllers.ts'

const router = Router()

// CREATE PRODUCT
router.post('/', createProduct)

// GET ALL PRODUCTS
router.get('/', getProducts)

// GET SINGLE PRODUCT
router.get('/:id', getProduct)

// UPDATE PRODUCT
router.put('/:id', updateProduct)

// SOFT DELETE PRODUCT
router.delete('/:id', softDeleteProduct)

export default router
