import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});


export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CreateSaleDTO {
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  paidAmount: number;
  paymentMethod: string;
  discount?: number;
  notes?: string;
}

export interface UpdateSaleDTO {
  items?: SaleItem[];
  totalAmount?: number;
  paidAmount?: number;
}

export interface Sale {
  id: string;
  customerId: string;
  shopId: string;
  items: SaleItem[];
  totalAmount: number;
  paidAmount: number;
}


async function createSale(data: CreateSaleDTO) {
  const res = await api.post("/sales", data);
  return res.data;
}


async function getSales(params?: { shopId?: string }) {
  const res = await api.get("/sales", { params });
  return res.data;
}


async function getSaleById(saleId: string) {
  const res = await api.get(`/sales/${saleId}`);
  return res.data;
}


async function updateSale(saleId: string, data: UpdateSaleDTO) {
  const res = await api.put(`/sales/${saleId}`, data);
  return res.data;
}


async function deleteSale(saleId: string) {
  const res = await api.delete(`/sales/${saleId}`);
  return res.data;
}

async function getAllSales(){
  const res = await api.get("/sales");
  return res.data.data;
}


export { createSale, getSales, getSaleById, updateSale, deleteSale, getAllSales };
