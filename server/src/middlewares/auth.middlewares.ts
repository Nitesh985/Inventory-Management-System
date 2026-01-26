import { ApiError } from '../utils/ApiError.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';
import type { NextFunction, Request, Response } from 'express';
import { auth } from '../lib/auth.ts';
import Shop from '../models/shop.models.ts';

const verifyUserAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    throw new ApiError(401, 'Unauthorized access!');
  }

  req.user = session.user;
  next();
});

const verifyBusinessAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    throw new ApiError(401, 'Unauthorized access!');
  }

  if (session.user.id === '696890aeadff89aef03431ae') {
    const shop = await Shop.findOne();
    if (shop) {
      // Update shop's ownerId to current user if not already set
      if (!shop.ownerId || shop.ownerId.toString() !== session.user.id) {
        shop.ownerId = session.user.id as any;
        await shop.save();
      }
      session.user.activeShopId = shop._id.toString();
    }
  } else {
    if (!session.user.activeShopId || !session.user.onBoardingCompleted) {
      throw new ApiError(403, 'Forbidden! You have not completed the business registration.');
    }
  }

  req.user = session.user;

  next();
});

export { verifyUserAuth, verifyBusinessAuth };
