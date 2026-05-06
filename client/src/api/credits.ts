import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/credits`,
  withCredentials: true,
});

// Get credit summary (total receivable, collected, etc.)
export const getCreditSummary = async () => {
  const response = await api.get('/summary');
  return response.data;
};

// Get all customers with their balance info (calculated from sales & payments)
export const getCustomersWithBalance = async () => {
  const response = await api.get('/customers-with-balance');
  return response.data;
};

// Get credit history for a specific customer (all credit sales + payments)
export const getCustomerCreditHistory = async (customerId: string, limit?: number) => {
  const params = limit ? { limit } : {};
  const response = await api.get(`/history/${customerId}`, { params });
  return response.data;
};

// Create a payment for a customer
export const createPayment = async (data: {
  customerId: string;
  amount: number;
  method?: string;
  note?: string;
  date?: string;
}) => {
  const response = await api.post('/payment', data);
  return response.data;
};
