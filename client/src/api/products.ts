//products
import api from "./axiosApi";

export interface CreateProductDTO {
  shopId?: string;
  clientId?: string;
  sku: string;
  name: string;
  category?: string;
  description?: string;
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

async function bulkImportProducts(products: any[]) {
  const res = await api.post("/products/bulk-import", { products });
  return res.data;
}


async function getAllProducts(params?: { shopId?: string }) {
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

async function checkSkuAvailability(sku: string, excludeProductId?: string | number) {
  const res = await api.get("/products/check-sku", {
    params: { sku, excludeProductId }
  });
  return res.data;
}

const generateSku = async (payload: Record<string, unknown>) => {
  const { data } = await api.post("/products/generate-sku", payload);
  return data;
};


export {
  createProduct,
  bulkImportProducts,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  checkSkuAvailability,
  generateSku
};
