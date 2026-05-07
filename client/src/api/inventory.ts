import axios from "axios";


const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/inventory`,
  withCredentials: true,
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
  const res = await api.post("/", data);
  return res.data;
}

// 📄 Get All Inventory
async function getInventory(params?: {
  shopId?: string;
  productId?: string;
}) {
  const res = await api.get("/", { params });
  return res.data;
}

// 📌 Get Inventory by ID
async function getInventoryById(inventoryId: string) {
  const res = await api.get(`/${inventoryId}`);
  return res.data;
}

// ✏️ Update Inventory
async function updateInventory(inventoryId: string, data: UpdateInventoryDTO) {
  const res = await api.put(`/${inventoryId}`, data);
  return res.data;
}

// 🗑️ Delete Inventory
async function deleteInventory(inventoryId: string) {
  const res = await api.delete(`/${inventoryId}`);
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
