import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export interface CreateBudgetDTO {
  category: string;
  categoryName: string;
  limit: number;
  period?: 'monthly' | 'quarterly' | 'yearly';
}

export interface UpdateBudgetDTO {
  categoryName?: string;
  limit?: number;
  period?: 'monthly' | 'quarterly' | 'yearly';
}

export interface Budget {
  _id: string;
  shopId: string;
  category: string;
  categoryName: string;
  limit: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

// Create a new budget
async function createBudget(data: CreateBudgetDTO) {
  const res = await api.post("/budgets", data);
  return res.data;
}

// Get all budgets
async function getBudgets() {
  const res = await api.get("/budgets");
  return res.data;
}

// Get budget by ID
async function getBudgetById(budgetId: string) {
  const res = await api.get(`/budgets/${budgetId}`);
  return res.data;
}

// Update budget
async function updateBudget(budgetId: string, data: UpdateBudgetDTO) {
  const res = await api.put(`/budgets/${budgetId}`, data);
  return res.data;
}

// Delete budget
async function deleteBudget(budgetId: string) {
  const res = await api.delete(`/budgets/${budgetId}`);
  return res.data;
}

// Upsert budget (create or update by category)
async function upsertBudget(data: CreateBudgetDTO) {
  const res = await api.post("/budgets/upsert", data);
  return res.data;
}

export {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  upsertBudget,
};
