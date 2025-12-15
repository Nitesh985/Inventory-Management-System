import { Router } from 'express'
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  softDeleteProduct
} from '../controllers/product.controllers.ts'
import { mockupData } from '../middlewares/mockup.middlewares.ts'


const router = Router()
router.use(mockupData)

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
