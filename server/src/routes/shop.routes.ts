import { Router } from 'express'
import {
  createShop,
  getShops,
  getShop,
  updateShop,
  deleteShop
} from '../controllers/shop.controllers.ts'
import { mockupData } from '../middlewares/mockup.middlewares.ts'


const router = Router()
router.use(mockupData)

// CREATE SHOP
router.post('/', createShop)

// GET ALL SHOPS
router.get('/', getShops)

// GET SINGLE SHOP
router.get('/:id', getShop)

// UPDATE SHOP
router.put('/:id', updateShop)

// DELETE SHOP
router.delete('/:id', deleteShop)

export default router
