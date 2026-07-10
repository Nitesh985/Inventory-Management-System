import { ApiError } from '../utils/ApiError.ts';
import { asyncHandler } from '../utils/asyncHandler.ts';
import type { NextFunction, Request, Response } from 'express';
import { auth } from '../lib/auth.ts';
import Shop from '../models/shop.models.ts';
import { getAccessTokenFromRequest, getRefreshTokenFromRequest, rotateTokensForUser } from '../lib/auth.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';

const isProduction = process.env.NODE_ENV === 'production';
const cookieSameSite: 'none' | 'lax' = isProduction ? 'none' : 'lax';

const authCookieOptions = {
  httpOnly: true,
  sameSite: cookieSameSite,
  secure: isProduction,
  path: '/',
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', { ...authCookieOptions, maxAge: 0 });
  res.clearCookie('refreshToken', { ...authCookieOptions, maxAge: 0 });
};

const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie('accessToken', accessToken, {
    ...authCookieOptions,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    ...authCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

const attachUser = async (req: Request, res: Response, next: NextFunction, allowRefresh = true) => {
  const session = await auth.api.getSession({
    headers: req.headers as any,
    cookies: req.cookies as any,
  });

  if (session?.user) {
    req.user = session.user;
    return next();
  }

  if (!allowRefresh) {
    throw new ApiError(401, 'Unauthorized access!');
  }

  const refreshToken = getRefreshTokenFromRequest(req);

  if (!refreshToken) {
    throw new ApiError(401, 'Unauthorized access!');
  }

  try {
    const rotated = await rotateTokensForUser(refreshToken);
    setAuthCookies(res, rotated.accessToken, rotated.refreshToken);
    req.user = rotated.user;
    return next();
  } catch {
    clearAuthCookies(res);
    throw new ApiError(401, 'Unauthorized access!');
  }
};


const verifyUserAuth = asyncHandler(async(req, res, next)=>{
  await attachUser(req, res, next, true);
});


// const verifyUserAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//   const session = await auth.api.getSession({
//       headers: req.headers,
//     });

//   if (!session) {
//     throw new ApiError(401, 'Unauthorized access!');
//   }

//   req.user = session.user;
//   next();
// });

const verifyBusinessAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await attachUser(req, res, next, true);
})

// const verifyBusinessAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

//   const session = await auth.api.getSession({
//       headers: req.headers,
//     });

//   if (!session) {
//     throw new ApiError(401, 'Unauthorized access!');
//   }

//   // if (session.user.id === '696890aeadff89aef03431ae') {
//   //   const shop = await Shop.findOne();
//   //   if (shop) {
//   //     // Update shop's ownerId to current user if not already set
//   //     if (!shop.ownerId || shop.ownerId.toString() !== session.user.id) {
//   //       shop.ownerId = session.user.id as any;
//   //       await shop.save();
//   //     }
//   //     session.user.activeShopId = shop._id.toString();
//   //   }
//   // } else {
//   //   if (!session.user.activeShopId || !session.user.onBoardingCompleted) {
//   //     throw new ApiError(403, 'Forbidden! You have not completed the business registration.');
//   //   }
//   // }

//   req.user = session.user;

//   next();
// });

const verifyAdminAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const session = await auth.api.getSession({
      headers: req.headers as any,
      cookies: req.cookies as any,
    });

  if (!session) {
    const refreshToken = getRefreshTokenFromRequest(req);

    if (!refreshToken) {
      throw new ApiError(401, 'Unauthorized access!');
    }

    const rotated = await rotateTokensForUser(refreshToken);
    setAuthCookies(res, rotated.accessToken, rotated.refreshToken);

    if (rotated.user.role !== 'admin') {
      throw new ApiError(403, 'Forbidden! Admin access required.');
    }

    req.user = rotated.user;
    next();
    return;
  }

  if (session.user.role !== 'admin') {
    throw new ApiError(403, 'Forbidden! Admin access required.');
  }

  req.user = session.user;
  next();
});

export { verifyUserAuth, verifyBusinessAuth, verifyAdminAuth };
