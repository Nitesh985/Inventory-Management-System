// src/seed/budget.seed.ts
import Budget from "../models/budget.models.ts";
import { faker } from "@faker-js/faker";

const BUDGET_CATEGORIES = [
  { category: "Rent", categoryName: "Rent", minLimit: 20000, maxLimit: 60000 },
  { category: "Utilities", categoryName: "Utilities", minLimit: 3000, maxLimit: 10000 },
  { category: "Supplies", categoryName: "Supplies", minLimit: 5000, maxLimit: 15000 },
  { category: "Transport", categoryName: "Transport", minLimit: 3000, maxLimit: 8000 },
  { category: "Salary", categoryName: "Salary", minLimit: 30000, maxLimit: 100000 },
  { category: "Maintenance", categoryName: "Maintenance", minLimit: 2000, maxLimit: 10000 },
  { category: "Taxes & Fees", categoryName: "Taxes & Fees", minLimit: 5000, maxLimit: 20000 },
  { category: "Marketing", categoryName: "Marketing", minLimit: 2000, maxLimit: 15000 },
  { category: "Miscellaneous", categoryName: "Miscellaneous", minLimit: 1000, maxLimit: 5000 },
];

export async function seedBudgets(shopId: string) {
  // Each shop gets budgets for a random subset of categories
  const selectedCategories = faker.helpers.arrayElements(
    BUDGET_CATEGORIES,
    faker.number.int({ min: 5, max: BUDGET_CATEGORIES.length })
  );

  const budgets = selectedCategories.map((cat) => ({
    shopId,
    category: cat.category,
    categoryName: cat.categoryName,
    limit: faker.number.int({ min: cat.minLimit, max: cat.maxLimit }),
    period: faker.helpers.weightedArrayElement([
      { value: "monthly" as const, weight: 70 },
      { value: "quarterly" as const, weight: 20 },
      { value: "yearly" as const, weight: 10 },
    ]),
    deleted: false,
  }));

  const created = await Budget.insertMany(budgets);
  return created;
}
