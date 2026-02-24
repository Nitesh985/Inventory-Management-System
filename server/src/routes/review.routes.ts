import { Router } from 'express';
import { createReview, getMyReview, getPublicReviews } from '../controllers/review.controllers.ts';
import { verifyUserAuth } from '../middlewares/auth.middlewares.ts';

const router = Router();

// Public route - no auth required
router.route('/public').get(getPublicReviews);

router.use(verifyUserAuth);

// Create or update a review
router.route('/').post(createReview);

// Get current user's review for active shop
router.route('/my-review').get(getMyReview);

export default router;
