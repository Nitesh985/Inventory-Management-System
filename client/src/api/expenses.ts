import axios from "axios";



const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/expenses`,
});


export interface CreateExpenseDTO {
  shopId: string;
  clientId: string;
  description: string;
  amount: number;
  date: string;
  category?: string;
}

export interface UpdateExpenseDTO {
  description?: string;
  amount?: number;
  date?: string;
  category?: string;
}




async function createExpense(data: CreateExpenseDTO) {
  const res = await api.post("", data);
  return res.data;
}


async function getExpenses(params?: {
  shopId?: string;
  clientId?: string;
  from?: string;
  to?: string;
}) {
  const res = await api.get("", { params });
  return res.data;
}


async function getExpenseById(expenseId: string) {
  const res = await api.get(`/${expenseId}`);
  return res.data;
}


async function updateExpense(expenseId: string, data: UpdateExpenseDTO) {
  const res = await api.put(`/${expenseId}`, data);
  return res.data;
}


async function deleteExpense(expenseId: string) {
  const res = await api.delete(`/${expenseId}`);
  return res.data;
}


export {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
