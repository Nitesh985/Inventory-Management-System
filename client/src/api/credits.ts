import axios from 'axios';

// Get credit summary (total receivable, collected, etc.)
export const getCreditSummary = async () => {
  const response = await axios.get('/api/credits/summary');
  return response.data;
};

// Get all customers with their balance info (calculated from sales & payments)
export const getCustomersWithBalance = async () => {
  const response = await axios.get('/api/credits/customers-with-balance');
  return response.data;
};

// Get credit history for a specific customer (all credit sales + payments)
export const getCustomerCreditHistory = async (customerId: string) => {
  const response = await axios.get(`/api/credits/history/${customerId}`);
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
  const response = await axios.post('/api/credits/payment', data);
  return response.data;
};
