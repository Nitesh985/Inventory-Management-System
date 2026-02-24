import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export interface Supplier {
  _id: string;
  shopId: string;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  notes?: string;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierDTO {
  name: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  notes?: string;
}

export interface UpdateSupplierDTO {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  address?: string;
  notes?: string;
}

async function createSupplier(data: CreateSupplierDTO): Promise<Supplier> {
  const res = await api.post("/suppliers", data);
  return res.data;
}

async function getSuppliers() {
  const res = await api.get("/suppliers");
  return res.data;
}

async function getSupplierById(supplierId: string) {
  const res = await api.get(`/suppliers/${supplierId}`);
  return res.data;
}

async function updateSupplier(supplierId: string, data: UpdateSupplierDTO) {
  const res = await api.put(`/suppliers/${supplierId}`, data);
  return res.data;
}

async function deleteSupplier(supplierId: string) {
  const res = await api.delete(`/suppliers/${supplierId}`);
  return res.data;
}

export {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
