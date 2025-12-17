// src/seed/expenses.seed.ts
import Expense from "../models/expense.models.ts";
import { faker } from "@faker-js/faker";

export async function seedExpenses(
  shopId: string,
  clientId: string,
  count = 15
) {
  const expenses = [];

  for (let i = 0; i < count; i++) {
    expenses.push({
      shopId,
      clientId,
      description: faker.commerce.productDescription(),
      amount: faker.number.int({ min: 100, max: 5000 }),
      date: faker.date.recent({ days: 60 }),
      category: faker.helpers.arrayElement([
        "Rent",
        "Utilities",
        "Supplies",
        "Transport",
      ]),
    });
  }

  return await Expense.insertMany(expenses);
}
