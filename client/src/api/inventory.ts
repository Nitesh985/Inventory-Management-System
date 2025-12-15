// src/api/inventory.ts
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});


export interface CreateOrUpdateInventoryDTO {
  shopId?: string;
  productId?: string;
  stock: number;
  reserved?: number;
}

export interface UpdateInventoryDTO {
  stock?: number;
  reserved?: number;
}

export interface Inventory {
  id: string;
  shopId: string;
  productId: string;
  stock: number;
  reserved: number;
}



async function createOrUpdateInventory(data: CreateOrUpdateInventoryDTO) {
  const res = await api.post("/inventory", data);
  return res.data;
}

// 📄 Get All Inventory
async function getInventory(params?: {
  shopId?: string;
  productId?: string;
}) {
  const res = await api.get("/inventory", { params });
  return res.data;
}

// 📌 Get Inventory by ID
async function getInventoryById(inventoryId: string) {
  const res = await api.get(`/inventory/${inventoryId}`);
  return res.data;
}

// ✏️ Update Inventory
async function updateInventory(inventoryId: string, data: UpdateInventoryDTO) {
  const res = await api.put(`/inventory/${inventoryId}`, data);
  return res.data;
}

// 🗑️ Delete Inventory
async function deleteInventory(inventoryId: string) {
  const res = await api.delete(`/inventory/${inventoryId}`);
  return res.data;
}

// ------------------------------
// EXPORTS
// ------------------------------
export {
  createOrUpdateInventory,
  getInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
};
