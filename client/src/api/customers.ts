import axios from "axios";



const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/customers`,
  withCredentials: true,
});

export interface CreateCustomerDTO {
  shopId: string;
  clientId: string;
  name: string;
  contact?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  contact?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface Customer {
  id: string;
  shopId: string;
  clientId: string;
  name: string;
  contact?: string;
  email?: string;
  address?: string;
  notes?: string;
}

async function createCustomer(
  data: CreateCustomerDTO
): Promise<Customer> {
  const res = await api.post<Customer>("/", data);
  return res.data;
}


async function getCustomers(params?: {
  shopId?: string;
  clientId?: string;
}) {
  const res = await api.get("/", { params });
  return res.data;
}

async function getCustomerById(customerId: string) {
  const res = await api.get(`/${customerId}`);
  return res.data;
}

async function updateCustomer(customerId: string, data: UpdateCustomerDTO) {
  const res = await api.put(`/${customerId}`, data);
  return res.data;
}

async function deleteCustomer(customerId: string) {
  const res = await api.delete(`/${customerId}`);
  return res.data;
}

async function getCustomerOutstanding(customerId: string) {
  const res = await api.get(`/outstanding/${customerId}`);
  return res.data;
}


export {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  getCustomerOutstanding,
};
