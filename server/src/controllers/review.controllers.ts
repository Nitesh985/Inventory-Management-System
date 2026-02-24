import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiError } from '../utils/ApiError.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import Review from '../models/review.models.ts';
import Shop from '../models/shop.models.ts';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

const createReview = asyncHandler(async (req: Request, res: Response) => {
  const { stars, content } = req.body;
  const userId = req.user?.id;
  const shopId = req.user?.activeShopId;

  if (!userId) {
    throw new ApiError(401, 'Unauthorized access!');
  }

  if (!shopId) {
    throw new ApiError(400, 'No active shop found. Please select a shop first.');
  }

  if (!stars || !content) {
    throw new ApiError(400, 'Stars and content are required.');
  }

  if (stars < 1 || stars > 5) {
    throw new ApiError(400, 'Stars must be between 1 and 5.');
  }

  if (content.length > 1000) {
    throw new ApiError(400, 'Review content must be under 1000 characters.');
  }

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const shopObjectId = new mongoose.Types.ObjectId(shopId);

  // Upsert: update if exists, create if not
  const review = await Review.findOneAndUpdate(
    { shopId: shopObjectId, userId: userObjectId },
    { stars, content, shopId: shopObjectId, userId: userObjectId },
    { upsert: true, new: true, runValidators: true }
  );

  return res.status(201).json(
    new ApiResponse(201, review, 'Review submitted successfully!')
  );
});

const getMyReview = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const shopId = req.user?.activeShopId;

  if (!userId || !shopId) {
    throw new ApiError(400, 'User and active shop are required.');
  }

  const review = await Review.findOne({
    shopId: new mongoose.Types.ObjectId(shopId),
    userId: new mongoose.Types.ObjectId(userId),
  });

  return res.status(200).json(
    new ApiResponse(200, review, 'Review fetched successfully.')
  );
});

const getPublicReviews = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 6, 20);

  // Get reviews with shop data populated
  const reviews = await Review.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('shopId', 'name businessType')
    .lean();

  if (!reviews.length) {
    return res.status(200).json(
      new ApiResponse(200, [], 'No reviews found.')
    );
  }

  // Fetch user data from the auth database
  const userIds = reviews.map((r: any) => new mongoose.Types.ObjectId(r.userId));
  const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
  
  try {
    await client.connect();
    const authDb = client.db();
    const users = await authDb.collection('user').find(
      { _id: { $in: userIds } },
      { projection: { _id: 1, name: 1, image: 1 } }
    ).toArray();

    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    const formatted = reviews.map((r: any) => {
      const user = userMap.get(r.userId.toString());
      return {
        _id: r._id,
        stars: r.stars,
        content: r.content,
        userName: user?.name || 'Anonymous',
        userImage: user?.image || null,
        shopName: (r.shopId as any)?.name || '',
        businessType: (r.shopId as any)?.businessType || '',
        createdAt: r.createdAt,
      };
    });

    return res.status(200).json(
      new ApiResponse(200, formatted, 'Reviews fetched successfully.')
    );
  } finally {
    await client.close();
  }
});

export { createReview, getMyReview, getPublicReviews };
