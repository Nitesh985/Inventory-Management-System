import axios from 'axios';

// Get all credits (optionally filtered by customerId)
export const getCredits = async (customerId?: string) => {
  const params = customerId ? { customerId } : {};
  const response = await axios.get('/api/credits', { params });
  return response.data;
};

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

// Create a new credit entry
export const createCredit = async (data: {
  customerId: string;
  amount: number;
  description?: string;
  date?: string;
}) => {
  const response = await axios.post('/api/credits', data);
  return response.data;
};

// Alias for createCredit
export const postCredit = createCredit;

// Get credit by ID
export const getCreditById = async (id: string) => {
  const response = await axios.get(`/api/credits/${id}`);
  return response.data;
};

// Update credit
export const updateCredit = async (id: string, data: {
  amount?: number;
  description?: string;
  date?: string;
}) => {
  const response = await axios.put(`/api/credits/${id}`, data);
  return response.data;
};

// Delete credit
export const deleteCredit = async (id: string) => {
  const response = await axios.delete(`/api/credits/${id}`);
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
