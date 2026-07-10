import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { MongoClient, ObjectId } from 'mongodb';
import { ApiError } from '../utils/ApiError.ts';
import type { IncomingHttpHeaders } from 'http';

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set');
}

if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be set');
}

const client = new MongoClient(`${process.env.MONGODB_URI}/auth`);
export const db = client.db();

const ACCESS_TOKEN_COOKIE = 'accessToken';
const REFRESH_TOKEN_COOKIE = 'refreshToken';
const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '30d';

type UserRecord = {
  _id: ObjectId;
  name?: string;
  email: string;
  image?: string | null;
  passwordHash?: string;
  activeShopId?: string | null;
  hasCompletedTour?: boolean;
  onBoardingCompleted?: boolean;
  emailVerified?: boolean;
  role?: string;
  refreshTokenHash?: string | null;
  refreshTokenExpiresAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  activeShopId?: string | null;
  hasCompletedTour: boolean;
  onBoardingCompleted: boolean;
  emailVerified: boolean;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type RequestLike = {
  headers?: IncomingHttpHeaders;
  cookies?: Record<string, string | undefined>;
};

type UpdateUserPayload = {
  name?: string;
  email?: string;
  image?: string | null;
  activeShopId?: string | null;
  hasCompletedTour?: boolean;
  onBoardingCompleted?: boolean;
  emailVerified?: boolean;
  role?: string;
};

const users = db.collection<UserRecord>('user');

const parseCookies = (cookieHeader?: string) => {
  const parsed: Record<string, string> = {};

  if (!cookieHeader) {
    return parsed;
  }

  for (const entry of cookieHeader.split(';')) {
    const [rawKey, ...rawValue] = entry.trim().split('=');
    if (!rawKey) continue;
    parsed[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue.join('=') || '');
  }

  return parsed;
};

const getRequestCookies = (request?: RequestLike) => ({
  ...parseCookies(request?.headers?.cookie),
  ...request?.cookies,
});

export const getAccessTokenFromRequest = (request?: RequestLike) => {
  const cookies = getRequestCookies(request);
  const authorization = request?.headers?.authorization;

  if (authorization?.startsWith('Bearer ')) {
    return authorization.slice(7);
  }

  return cookies[ACCESS_TOKEN_COOKIE];
};

export const getRefreshTokenFromRequest = (request?: RequestLike) => {
  const cookies = getRequestCookies(request);
  return cookies[REFRESH_TOKEN_COOKIE];
};

export const hashToken = (token: string) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const serializeUser = (user: UserRecord): AuthUser => ({
  id: user._id.toString(),
  name: user.name || '',
  email: user.email,
  image: user.image ?? null,
  activeShopId: user.activeShopId ?? null,
  hasCompletedTour: Boolean(user.hasCompletedTour),
  onBoardingCompleted: Boolean(user.onBoardingCompleted),
  emailVerified: Boolean(user.emailVerified),
  role: user.role || 'user',
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const findUserById = async (userId: string) => {
  if (!ObjectId.isValid(userId)) {
    return null;
  }

  return users.findOne({ _id: new ObjectId(userId) });
};

const findUserByEmail = async (email: string) => users.findOne({ email: email.toLowerCase().trim() });

const signAccessToken = (userId: string) =>
  jwt.sign({ sub: userId }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: ACCESS_TOKEN_TTL });

const signRefreshToken = (userId: string) =>
  jwt.sign({ sub: userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: REFRESH_TOKEN_TTL });

export const buildAuthTokens = (userId: string) => {
  const accessToken = signAccessToken(userId);
  const refreshToken = signRefreshToken(userId);

  return {
    accessToken,
    refreshToken,
    refreshTokenHash: hashToken(refreshToken),
    refreshTokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
};

export const issueTokensForUser = async (userId: string) => {
  const tokens = buildAuthTokens(userId);

  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        refreshTokenHash: tokens.refreshTokenHash,
        refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
        updatedAt: new Date(),
      },
    },
  );

  return tokens;
};

export const revokeRefreshTokenForUser = async (userId: string) => {
  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $unset: {
        refreshTokenHash: '',
        refreshTokenExpiresAt: '',
      },
      $set: {
        updatedAt: new Date(),
      },
    },
  );
};

const resolveCurrentUser = async (request?: RequestLike) => {
  const accessToken = getAccessTokenFromRequest(request);

  if (!accessToken) {
    return null;
  }

  try {
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as jwt.JwtPayload;
    const userId = typeof payload.sub === 'string' ? payload.sub : '';

    if (!userId) {
      return null;
    }

    const user = await findUserById(userId);
    return user ? serializeUser(user) : null;
  } catch {
    return null;
  }
};

const updateUserRecord = async (userId: string, payload: UpdateUserPayload) => {
  const updatePayload = Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined),
  );

  if (Object.keys(updatePayload).length > 0) {
    await users.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          ...updatePayload,
          updatedAt: new Date(),
        },
      },
    );
  }

  const user = await findUserById(userId);
  return user ? serializeUser(user) : null;
};

export const verifyUserPassword = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user?.passwordHash) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  return isValid ? user : null;
};

export const createCredentialUser = async ({ name, email, password }: { name: string; email: string; password: string }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new ApiError(400, 'An account with this email already exists.');
  }

  const now = new Date();
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await users.insertOne({
    name,
    email: normalizedEmail,
    passwordHash,
    activeShopId: null,
    hasCompletedTour: false,
    onBoardingCompleted: false,
    emailVerified: false,
    role: 'user',
    refreshTokenHash: null,
    refreshTokenExpiresAt: null,
    createdAt: now,
    updatedAt: now,
  } as any);

  const user = await findUserById(result.insertedId.toString());

  if (!user) {
    throw new ApiError(500, 'Failed to create user');
  }

  return user;
};

export const rotateTokensForUser = async (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;
  const userId = typeof payload.sub === 'string' ? payload.sub : '';

  if (!userId) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await findUserById(userId);

  if (!user?.refreshTokenHash || user.refreshTokenHash !== hashToken(refreshToken)) {
    throw new ApiError(401, 'Refresh token has been revoked');
  }

  const tokens = buildAuthTokens(userId);

  await users.updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: {
        refreshTokenHash: tokens.refreshTokenHash,
        refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
        updatedAt: new Date(),
      },
    },
  );

  const updatedUser = await findUserById(userId);

  if (!updatedUser) {
    throw new ApiError(404, 'User not found');
  }

  return {
    user: serializeUser(updatedUser),
    ...tokens,
  };
};

export const auth = {
  api: {
    getSession: async (request?: RequestLike) => {
      const user = await resolveCurrentUser(request);
      return user ? { user } : null;
    },
    updateUser: async ({ body, headers, cookies }: { body: UpdateUserPayload; headers?: RequestLike['headers']; cookies?: RequestLike['cookies'] }) => {
      const currentUser = await resolveCurrentUser({ headers, cookies });

      if (!currentUser) {
        throw new ApiError(401, 'Unauthorized access!');
      }

      const updatedUser = await updateUserRecord(currentUser.id, body);

      if (!updatedUser) {
        throw new ApiError(404, 'User not found');
      }

      return { user: updatedUser };
    },
    listAccounts: async (request?: RequestLike) => {
      const currentUser = await resolveCurrentUser(request);

      return {
        data: currentUser
          ? [
              {
                id: currentUser.id,
                providerId: 'credential',
                accountId: currentUser.email,
                userId: currentUser.id,
              },
            ]
          : [],
      };
    },
    changePassword: async ({ currentPassword, newPassword, headers, cookies }: { currentPassword: string; newPassword: string; headers?: RequestLike['headers']; cookies?: RequestLike['cookies'] }) => {
      const currentUser = await resolveCurrentUser({ headers, cookies });

      if (!currentUser) {
        throw new ApiError(401, 'Unauthorized access!');
      }

      const user = await findUserById(currentUser.id);

      if (!user?.passwordHash) {
        throw new ApiError(400, 'This account does not use password login.');
      }

      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);

      if (!isValid) {
        throw new ApiError(400, 'Current password is incorrect.');
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await users.updateOne(
        { _id: new ObjectId(currentUser.id) },
        {
          $set: {
            passwordHash,
            updatedAt: new Date(),
          },
        },
      );

      return { user: await resolveCurrentUser({ headers, cookies }) };
    },
  },
};

export const getAuthUserFromRequest = resolveCurrentUser;