import { Router } from 'express';
import {
  getUsers,
  deleteUser,
  updateUserRole,
  getAllShops,
  adminDeleteShop,
  getAllReviews,
  adminDeleteReview,
  getAdminStats,
} from '../controllers/admin.controllers.ts';
import { verifyAdminAuth } from '../middlewares/auth.middlewares.ts';

const router = Router();

// All admin routes require admin auth
router.use(verifyAdminAuth);

// Dashboard stats
router.route('/stats').get(getAdminStats);

// Users
router.route('/users').get(getUsers);
router.route('/users/:id').delete(deleteUser);
router.route('/users/:id/role').put(updateUserRole);

// Shops
router.route('/shops').get(getAllShops);
router.route('/shops/:id').delete(adminDeleteShop);

// Reviews
router.route('/reviews').get(getAllReviews);
router.route('/reviews/:id').delete(adminDeleteReview);

export default router;
