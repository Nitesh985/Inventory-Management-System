import { Router } from 'express'
import {
  createShop,
  getShops,
  getShopStats,
  getMyShops,
  setActiveShop,
  getShop,
  getActiveShopProfile,
  updateActiveShopProfile,
  updateShop,
  deleteShop
} from '../controllers/shop.controllers.ts'
import { verifyUserAuth, verifyBusinessAuth } from '../middlewares/auth.middlewares.ts'


const router = Router()

// Public route - no authentication required
router.route("/stats").get(getShopStats)

// All other shop routes require authentication
router.use(verifyUserAuth)

// GET MY SHOPS (shops owned by current user)
router.route("/my-shops").get(getMyShops)

// SET ACTIVE SHOP
router.route("/set-active").post(setActiveShop)

// GET ACTIVE SHOP PROFILE (requires active shop)
router.route("/profile").get(verifyBusinessAuth, getActiveShopProfile)

// UPDATE ACTIVE SHOP PROFILE (requires active shop)
router.route("/profile").put(verifyBusinessAuth, updateActiveShopProfile)

// CREATE SHOP
router.route("/").post(createShop)

// GET ALL SHOPS
router.route("/").get(getShops)

// GET SINGLE SHOP
router.route("/:id").get(getShop)

// UPDATE SHOP
router.route("/:id").put(updateShop)

// DELETE SHOP
router.route("/:id").delete(deleteShop)

export default router
