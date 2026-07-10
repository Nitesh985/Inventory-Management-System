import { useEffect, useState } from 'react';
import api from '@/api/axiosApi';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  activeShopId?: string | null;
  hasCompletedTour: boolean;
  onBoardingCompleted: boolean;
  emailVerified: boolean;
  role: string;
  createdAt?: string;
  updatedAt?: string;
};

type Session = {
  user: AuthUser;
};

type AuthResult = {
  data: Session | null;
  error: Error | null;
};

type AuthMutationResult = {
  data: Session | null;
  error: Error | null;
};

const sessionListeners = new Set<() => void>();
let currentSession: Session | null = null;
let currentSessionPromise: Promise<Session | null> | null = null;

const notifySessionListeners = () => {
  for (const listener of sessionListeners) {
    listener();
  }
};

const normalizeSession = (payload: any): Session | null => {
  const user = payload?.data?.user ?? payload?.user ?? payload;

  if (!user) {
    return null;
  }

  return { user };
};

const setSession = (session: Session | null) => {
  currentSession = session;
  notifySessionListeners();
};

const clearSession = () => {
  currentSession = null;
  notifySessionListeners();
};

const fetchSession = async () => {
  if (currentSessionPromise) {
    return currentSessionPromise;
  }

  currentSessionPromise = api
    .get('/auth/me')
    .then((response) => normalizeSession(response.data))
    .catch(() => null)
    .finally(() => {
      currentSessionPromise = null;
    });

  const session = await currentSessionPromise;
  setSession(session);
  return session;
};

export const authClient = {
  async getSession() {
    if (currentSession) {
      return { data: currentSession, error: null };
    }

    const session = await fetchSession();
    return { data: session, error: null };
  },
};

export const signIn = {
  async email({ email, password }: { email: string; password: string; rememberMe?: boolean }) {
    try {
      const response = await api.post('/auth/login', { email, password });
      const session = normalizeSession(response.data);
      setSession(session);
      return { data: session, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },
  async social() {
    return { data: null, error: new Error('Social login is not supported in the manual token auth flow.') };
  },
};

export const signUp = {
  async email({ name, email, password }: { name: string; email: string; password: string; callbackURL?: string }) {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      const session = normalizeSession(response.data);
      setSession(session);
      return { data: session, error: null };
    } catch (error: any) {
      return { data: null, error };
    }
  },
};

export const signOut = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    clearSession();
  }
};

export const updateUser = async (body: Record<string, any>) => {
  try {
    const response = await api.patch('/auth/me', body);
    const session = normalizeSession(response.data);
    if (session) {
      setSession(session);
    }
    return { data: session, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const changePassword = async (body: { currentPassword: string; newPassword: string; revokeOtherSessions?: boolean }) => {
  try {
    const response = await api.post('/auth/change-password', body);
    return { data: normalizeSession(response.data), error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const changeEmail = async (body: { email: string }) => {
  return updateUser(body);
};

export const listAccounts = async () => {
  try {
    const response = await api.get('/auth/accounts');
    return { data: response.data?.data ?? [], error: null };
  } catch (error: any) {
    return { data: [], error };
  }
};

export const getSession = async () => authClient.getSession();

export const useSession = () => {
  const [data, setData] = useState<Session | null>(currentSession);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const listener = () => {
      setData(currentSession);
    };

    sessionListeners.add(listener);
    listener();

    const loadSession = async () => {
      setIsPending(true);
      await fetchSession();
      setIsPending(false);
    };

    loadSession();

    const handleLogout = () => {
      clearSession();
      setIsPending(false);
    };

    window.addEventListener('auth:logout', handleLogout);

    return () => {
      sessionListeners.delete(listener);
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  return { data, isPending };
};
