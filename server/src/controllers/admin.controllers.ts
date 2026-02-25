import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiError } from '../utils/ApiError.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import Shop from '../models/shop.models.ts';
import Review from '../models/review.models.ts';
import mongoose from 'mongoose';
import { MongoClient, ObjectId } from 'mongodb';

// ─── Users ───────────────────────────────────────────────

const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const search = (req.query.search as string) || '';
  const skip = (page - 1) * limit;

  const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
  try {
    await client.connect();
    const db = client.db();
    const usersCollection = db.collection('user');

    // Exclude the current admin from results
    const filter: any = { _id: { $ne: new ObjectId(req.user!.id) } };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      usersCollection
        .find(filter, {
          projection: { _id: 1, name: 1, email: 1, image: 1, role: 1, emailVerified: 1, onBoardingCompleted: 1, createdAt: 1 },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      usersCollection.countDocuments(filter),
    ]);

    // For each user, get their shop names
    const userIds = users.map((u) => new mongoose.Types.ObjectId(u._id.toString()));
    const shops = await Shop.find(
      { ownerId: { $in: userIds } },
      { ownerId: 1, name: 1 }
    ).lean();
    const shopNameMap = new Map<string, string[]>();
    for (const s of shops) {
      const ownerId = s.ownerId.toString();
      if (!shopNameMap.has(ownerId)) shopNameMap.set(ownerId, []);
      shopNameMap.get(ownerId)!.push(s.name);
    }

    const formatted = users.map((u) => ({
      _id: u._id.toString(),
      name: u.name || 'N/A',
      email: u.email,
      image: u.image || null,
      role: u.role || 'user',
      emailVerified: u.emailVerified || false,
      onBoardingCompleted: u.onBoardingCompleted || false,
      shopNames: shopNameMap.get(u._id.toString()) || [],
      createdAt: u.createdAt,
    }));

    return res.status(200).json(
      new ApiResponse(200, { users: formatted, total, page, limit, totalPages: Math.ceil(total / limit) }, 'Users fetched')
    );
  } finally {
    await client.close();
  }
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) throw new ApiError(400, 'User ID is required');

  // Don't let admin delete themselves
  if (userId === req.user?.id) {
    throw new ApiError(400, 'You cannot delete your own account from admin panel.');
  }

  const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
  try {
    await client.connect();
    const db = client.db();

    const user = await db.collection('user').findOne({ _id: new ObjectId(userId) });
    if (!user) throw new ApiError(404, 'User not found');

    // Delete user's shops, reviews
    const userObjectId = new mongoose.Types.ObjectId(userId);
    await Promise.all([
      Shop.deleteMany({ ownerId: userObjectId }),
      Review.deleteMany({ userId: userObjectId }),
      db.collection('user').deleteOne({ _id: new ObjectId(userId) }),
      db.collection('session').deleteMany({ userId: new ObjectId(userId) }),
      db.collection('account').deleteMany({ userId: new ObjectId(userId) }),
    ]);

    return res.status(200).json(new ApiResponse(200, {}, 'User and related data deleted'));
  } finally {
    await client.close();
  }
});

const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!userId) throw new ApiError(400, 'User ID is required');
  if (!role || !['user', 'admin'].includes(role)) {
    throw new ApiError(400, 'Role must be "user" or "admin".');
  }

  if (userId === req.user?.id) {
    throw new ApiError(400, 'You cannot change your own role.');
  }

  const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
  try {
    await client.connect();
    const db = client.db();

    const result = await db.collection('user').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { role } }
    );

    if (result.matchedCount === 0) throw new ApiError(404, 'User not found');

    return res.status(200).json(new ApiResponse(200, { role }, 'User role updated'));
  } finally {
    await client.close();
  }
});

// ─── Shops ───────────────────────────────────────────────

const getAllShops = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const search = (req.query.search as string) || '';
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { businessType: { $regex: search, $options: 'i' } },
    ];
  }

  const [shops, total] = await Promise.all([
    Shop.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Shop.countDocuments(filter),
  ]);

  // Get owner names from auth db
  const ownerIds = [...new Set(shops.map((s: any) => s.ownerId?.toString()).filter(Boolean))];

  let ownerMap = new Map();
  if (ownerIds.length > 0) {
    const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
    try {
      await client.connect();
      const db = client.db();
      const owners = await db.collection('user').find(
        { _id: { $in: ownerIds.map((id: string) => new ObjectId(id)) } },
        { projection: { _id: 1, name: 1, email: 1 } }
      ).toArray();
      ownerMap = new Map(owners.map(o => [o._id.toString(), o]));
    } finally {
      await client.close();
    }
  }

  const formatted = shops.map((s: any) => {
    const owner = ownerMap.get(s.ownerId?.toString());
    return {
      ...s,
      _id: s._id.toString(),
      ownerName: owner?.name || 'Unknown',
      ownerEmail: owner?.email || '',
    };
  });

  return res.status(200).json(
    new ApiResponse(200, { shops: formatted, total, page, limit, totalPages: Math.ceil(total / limit) }, 'Shops fetched')
  );
});

const adminDeleteShop = asyncHandler(async (req: Request, res: Response) => {
  const shopId = req.params.id;
  if (!shopId) throw new ApiError(400, 'Shop ID is required');

  const shop = await Shop.findById(shopId);
  if (!shop) throw new ApiError(404, 'Shop not found');

  // Delete associated reviews
  await Review.deleteMany({ shopId: new mongoose.Types.ObjectId(shopId) });
  await Shop.findByIdAndDelete(shopId);

  return res.status(200).json(new ApiResponse(200, {}, 'Shop and its reviews deleted'));
});

// ─── Reviews ─────────────────────────────────────────────

const getAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('shopId', 'name businessType')
      .lean(),
    Review.countDocuments(),
  ]);

  // Get user data from auth db
  const userIds = reviews.map((r: any) => r.userId);
  let userMap = new Map();

  if (userIds.length > 0) {
    const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
    try {
      await client.connect();
      const db = client.db();
      const users = await db.collection('user').find(
        { _id: { $in: userIds.map((id: any) => new ObjectId(id.toString())) } },
        { projection: { _id: 1, name: 1, email: 1, image: 1 } }
      ).toArray();
      userMap = new Map(users.map(u => [u._id.toString(), u]));
    } finally {
      await client.close();
    }
  }

  const formatted = reviews.map((r: any) => {
    const user = userMap.get(r.userId?.toString());
    return {
      _id: r._id,
      stars: r.stars,
      content: r.content,
      userName: user?.name || 'Anonymous',
      userEmail: user?.email || '',
      userImage: user?.image || null,
      shopName: r.shopId?.name || 'Deleted Shop',
      businessType: r.shopId?.businessType || '',
      createdAt: r.createdAt,
    };
  });

  return res.status(200).json(
    new ApiResponse(200, { reviews: formatted, total, page, limit, totalPages: Math.ceil(total / limit) }, 'Reviews fetched')
  );
});

const adminDeleteReview = asyncHandler(async (req: Request, res: Response) => {
  const reviewId = req.params.id;
  if (!reviewId) throw new ApiError(400, 'Review ID is required');

  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) throw new ApiError(404, 'Review not found');

  return res.status(200).json(new ApiResponse(200, {}, 'Review deleted'));
});

// ─── Dashboard Stats ─────────────────────────────────────

const getAdminStats = asyncHandler(async (req: Request, res: Response) => {
  const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
  try {
    await client.connect();
    const db = client.db();

    const [totalUsers, totalShops, totalReviews] = await Promise.all([
      db.collection('user').countDocuments(),
      Shop.countDocuments(),
      Review.countDocuments(),
    ]);

    const avgRating = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: '$stars' } } },
    ]);

    return res.status(200).json(
      new ApiResponse(200, {
        totalUsers,
        totalShops,
        totalReviews,
        avgRating: avgRating[0]?.avg ? parseFloat(avgRating[0].avg.toFixed(1)) : 0,
      }, 'Admin stats fetched')
    );
  } finally {
    await client.close();
  }
});

export {
  getUsers,
  deleteUser,
  updateUserRole,
  getAllShops,
  adminDeleteShop,
  getAllReviews,
  adminDeleteReview,
  getAdminStats,
};
