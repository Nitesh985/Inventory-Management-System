import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.ts';
import { ApiError } from '../utils/ApiError.ts';
import { ApiResponse } from '../utils/ApiResponse.ts';
import {
  auth,
  createCredentialUser,
  getAuthUserFromRequest,
  getRefreshTokenFromRequest,
  issueTokensForUser,
  revokeRefreshTokenForUser,
  rotateTokensForUser,
  serializeUser,
  verifyUserPassword,
} from '../lib/auth.ts';

const isProduction = process.env.NODE_ENV === 'production';

const authCookieOptions = {
  httpOnly: true,
  sameSite: (isProduction ? 'none' : 'lax') as const,
  secure: isProduction,
  path: '/',
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

const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', authCookieOptions);
  res.clearCookie('refreshToken', authCookieOptions);
};

const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body ?? {};

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required.');
  }

  const user = await createCredentialUser({ name, email, password });
  const tokens = await issueTokensForUser(user.id);

  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  return res.status(201).json(new ApiResponse(201, { user: serializeUser(user) }, 'Account created successfully'));
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const user = await verifyUserPassword(email, password);

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const tokens = await issueTokensForUser(user._id.toString());
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  return res.status(200).json(new ApiResponse(200, { user: serializeUser(user) }, 'Signed in successfully'));
});

const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = getRefreshTokenFromRequest(req);

  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required.');
  }

  const rotated = await rotateTokensForUser(refreshToken);
  setAuthCookies(res, rotated.accessToken, rotated.refreshToken);

  return res.status(200).json(new ApiResponse(200, { user: rotated.user }, 'Token refreshed'));
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = await getAuthUserFromRequest({ headers: req.headers as any, cookies: req.cookies as any });

  if (currentUser?.id) {
    await revokeRefreshTokenForUser(currentUser.id);
  }

  clearAuthCookies(res);
  return res.status(200).json(new ApiResponse(200, {}, 'Signed out successfully'));
});

const me = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = await getAuthUserFromRequest({ headers: req.headers as any, cookies: req.cookies as any });

  if (!currentUser) {
    throw new ApiError(401, 'Unauthorized');
  }

  return res.status(200).json(new ApiResponse(200, { user: currentUser }, 'Session loaded'));
});

const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = await getAuthUserFromRequest({ headers: req.headers as any, cookies: req.cookies as any });

  if (!currentUser) {
    throw new ApiError(401, 'Unauthorized');
  }

  const updated = await auth.api.updateUser({
    body: req.body ?? {},
    headers: req.headers as any,
    cookies: req.cookies as any,
  });

  return res.status(200).json(new ApiResponse(200, updated.user, 'Profile updated'));
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const currentUser = await getAuthUserFromRequest({ headers: req.headers as any, cookies: req.cookies as any });

  if (!currentUser) {
    throw new ApiError(401, 'Unauthorized');
  }

  const { currentPassword, newPassword } = req.body ?? {};

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current password and new password are required.');
  }

  const updated = await auth.api.changePassword({
    currentPassword,
    newPassword,
    headers: req.headers as any,
    cookies: req.cookies as any,
  });

  return res.status(200).json(new ApiResponse(200, updated.user, 'Password updated'));
});

const accounts = asyncHandler(async (req: Request, res: Response) => {
  const result = await auth.api.listAccounts({
    headers: req.headers as any,
    cookies: req.cookies as any,
  });

  return res.status(200).json(new ApiResponse(200, result.data, 'Accounts loaded'));
});

export {
  accounts,
  changePassword,
  login,
  logout,
  me,
  refresh,
  register,
  updateMe,
};