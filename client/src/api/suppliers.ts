import axios from "axios";



const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/suppliers`,
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
  const res = await api.post("/", data);
  return res.data;
}

async function getSuppliers() {
  const res = await api.get("/");
  return res.data;
}

async function getSupplierById(supplierId: string) {
  const res = await api.get(`/${supplierId}`);
  return res.data;
}

async function updateSupplier(supplierId: string, data: UpdateSupplierDTO) {
  const res = await api.put(`/${supplierId}`, data);
  return res.data;
}

async function deleteSupplier(supplierId: string) {
  const res = await api.delete(`/${supplierId}`);
  return res.data;
}

export {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
};
