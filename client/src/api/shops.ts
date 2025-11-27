import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});


export interface CreateShopDTO {
  name: string;
  useBS?: boolean;
}

export interface UpdateShopDTO {
  name?: string;
  useBS?: boolean;
}

export interface Shop {
  id: string;
  name: string;
  useBS: boolean;
}


async function createShop(data: CreateShopDTO) {
  const res = await api.post("/shops", data);
  return res.data;
}

async function getShops() {
  const res = await api.get("/shops");
  return res.data;
}

async function getShopById(shopId: string) {
  const res = await api.get(`/shops/${shopId}`);
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

export { createShop, getShops, getShopById, updateShop, deleteShop };
