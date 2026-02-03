import axios from "axios";

const api = axios.create({
  baseURL: "/api/products",
});


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
  const res = await api.post("/", data);
  return res.data;
}

async function bulkImportProducts(products: any[]) {
  const res = await api.post("/bulk-import", { products });
  return res.data;
}


async function getAllProducts(params?: { shopId?: string }) {
  const res = await api.get("/", { params });
  return res.data;
}


async function getProductById(productId: string) {
  const res = await api.get(`/${productId}`);
  return res.data;
}


async function updateProduct(productId: string, data: UpdateProductDTO) {
  const res = await api.put(`/${productId}`, data);
  return res.data;
}


async function deleteProduct(productId: string) {
  const res = await api.delete(`/${productId}`);
  return res.data;
}

async function checkSkuAvailability(sku: string, excludeProductId?: string | number) {
  const res = await api.get("/check-sku", {
    params: { sku, excludeProductId }
  });
  return res.data;
}

const generateSku = async (payload) => {
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
