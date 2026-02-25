import axios from "axios";

const api = axios.create({
  baseURL: "/api/admin",
});

// ─── Types ───

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  emailVerified: boolean;
  onBoardingCompleted: boolean;
  shopNames: string[];
  createdAt: string;
}

export interface AdminShop {
  _id: string;
  name: string;
  businessType: string;
  ownerId: string;
  ownerName: string;
  ownerEmail: string;
  currency: string;
  city?: string;
  district?: string;
  province?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export interface AdminReview {
  _id: string;
  stars: number;
  content: string;
  userName: string;
  userEmail: string;
  userImage: string | null;
  shopName: string;
  businessType: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  totalShops: number;
  totalReviews: number;
  avgRating: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── API Calls ───

export const getAdminStats = async () => {
  const res = await api.get("/stats", { withCredentials: true });
  return res.data;
};

export const getUsers = async (page = 1, limit = 20, search = "") => {
  const res = await api.get("/users", {
    params: { page, limit, search },
    withCredentials: true,
  });
  return res.data;
};

export const deleteUser = async (userId: string) => {
  const res = await api.delete(`/users/${userId}`, { withCredentials: true });
  return res.data;
};

export const updateUserRole = async (userId: string, role: string) => {
  const res = await api.put(`/users/${userId}/role`, { role }, { withCredentials: true });
  return res.data;
};

export const getShops = async (page = 1, limit = 20, search = "") => {
  const res = await api.get("/shops", {
    params: { page, limit, search },
    withCredentials: true,
  });
  return res.data;
};

export const deleteShop = async (shopId: string) => {
  const res = await api.delete(`/shops/${shopId}`, { withCredentials: true });
  return res.data;
};

export const getReviews = async (page = 1, limit = 20) => {
  const res = await api.get("/reviews", {
    params: { page, limit },
    withCredentials: true,
  });
  return res.data;
};

export const deleteReview = async (reviewId: string) => {
  const res = await api.delete(`/reviews/${reviewId}`, { withCredentials: true });
  return res.data;
};
