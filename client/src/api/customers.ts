import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export interface CreateCustomerDTO {
  shopId: string;
  clientId: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerDTO {
  name?: string;
  phone?: string;
  address?: string;
}

export interface Customer {
  id: string;
  shopId: string;
  clientId: string;
  name: string;
  phone?: string;
  address?: string;
}

async function createCustomer(
  data: CreateCustomerDTO
): Promise<Customer> {
  const res = await api.post<Customer>("/customers", data);
  return res.data;
}


async function getCustomers(params?: {
  shopId?: string;
  clientId?: string;
}) {
  const res = await api.get("/customers", { params });
  return res.data.data;
}

async function getCustomerById(customerId: string) {
  const res = await api.get(`/customers/${customerId}`);
  return res.data;
}

async function updateCustomer(customerId: string, data: UpdateCustomerDTO) {
  const res = await api.put(`/customers/${customerId}`, data);
  return res.data;
}

async function deleteCustomer(customerId: string) {
  const res = await api.delete(`/customers/${customerId}`);
  return res.data;
}

async function getCustomerOutstanding(shopId: string, customerId: string) {
  const res = await api.get(`/customers/outstanding/${shopId}/${customerId}`);
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
