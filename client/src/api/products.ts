import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});


export interface CreateProductDTO {
  shopId: string;
  clientId: string;
  sku: string;
  name: string;
  category?: string;
  unit: number;
  price: number;
  cost: number;
  reorderLevel?: number;
}

export interface UpdateProductDTO {
  sku?: string;
  name?: string;
  category?: string;
  unit?: number;
  price?: number;
  cost?: number;
  reorderLevel?: number;
}

export interface Product {
  id: string;
  shopId: string;
  clientId: string;
  sku: string;
  name: string;
  category?: string;
  unit: number;
  price: number;
  cost: number;
  reorderLevel?: number;
}


async function createProduct(data: CreateProductDTO) {
  const res = await api.post("/products", data);
  return res.data;
}


async function getProducts(params?: { shopId?: string }) {
  const res = await api.get("/products", { params });
  return res.data;
}


async function getProductById(productId: string) {
  const res = await api.get(`/products/${productId}`);
  return res.data;
}


async function updateProduct(productId: string, data: UpdateProductDTO) {
  const res = await api.put(`/products/${productId}`, data);
  return res.data;
}


async function deleteProduct(productId: string) {
  const res = await api.delete(`/products/${productId}`);
  return res.data;
}


export {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
