import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});


export interface CreateShopDTO {
  name: string;
  useBS?: boolean;
  businessType: string;
}

export interface UpdateShopDTO {
  name?: string;
  useBS?: boolean;
}

export interface ShopProfile {
  _id: string;
  name: string;
  useBS: boolean;
  businessType: string;
  ownerId: string;
  // Business Profile Fields for Nepal
  panNumber?: string;
  vatNumber?: string;
  currency: string;
  address?: string;
  city?: string;
  district?: string;
  province?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateShopProfileDTO {
  name?: string;
  useBS?: boolean;
  businessType?: string;
  panNumber?: string;
  vatNumber?: string;
  currency?: string;
  address?: string;
  city?: string;
  district?: string;
  province?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
}

export interface Shop {
  _id: string;
  name: string;
  useBS: boolean;
  businessType: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyShopsResponse {
  shops: Shop[];
  activeShopId: string | null;
}


async function createShop(data: CreateShopDTO) {
  const res = await api.post("/shops", data);
  return res.data;
}

async function getShops() {
  const res = await api.get("/shops");
  return res.data;
}

// Get shop statistics (public endpoint - no auth required)
async function getShopStats() {
  const res = await api.get("/shops/stats");
  return res.data;
}

async function getShopById(shopId: string) {
  const res = await api.get(`/shops/${shopId}`);
  return res.data;
}

// Get all shops owned by the current user
async function getMyShops(): Promise<{ data: MyShopsResponse }> {
  const res = await api.get("/shops/my-shops");
  return res.data;
}

// Set the active shop for the current user
async function setActiveShop(shopId: string) {
  const res = await api.post("/shops/set-active", { shopId });
  return res.data;
}

// Get the current active shop profile
async function getActiveShopProfile(): Promise<{ data: ShopProfile }> {
  const res = await api.get("/shops/profile");
  return res.data;
}

// Update the current active shop profile
async function updateActiveShopProfile(data: UpdateShopProfileDTO): Promise<{ data: ShopProfile }> {
  const res = await api.put("/shops/profile", data);
  return res.data;
}

async function updateShop(shopId: string, data: UpdateShopDTO) {
  const res = await api.put(`/shops/${shopId}`, data);
  return res.data;
}

async function deleteShop(shopId: string) {
  const res = await api.delete(`/shops/${shopId}`);
  return res.data;
}

export { 
  createShop, 
  getShops,
  getShopStats,
  getShopById, 
  getMyShops, 
  setActiveShop, 
  getActiveShopProfile,
  updateActiveShopProfile,
  updateShop, 
  deleteShop 
};
