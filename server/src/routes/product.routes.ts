import { Router } from 'express'
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  softDeleteProduct,
  checkSkuAvailability,
  generateSku
} from '../controllers/product.controllers.ts'
import { verifyBusinessAuth } from '../middlewares/auth.middlewares.ts'


const router = Router()
router.use(verifyBusinessAuth)

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

router.get("/check-sku", checkSkuAvailability)

router.post("/generate-sku", generateSku)

export default router
