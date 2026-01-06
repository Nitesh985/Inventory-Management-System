// src/seed/expenses.seed.ts
import Expense from "../models/expense.models.ts";
import { faker } from "@faker-js/faker";
import { getDateForDay } from "./utils/dateHelpers.ts";

// Realistic expense descriptions by category for Nepal
const EXPENSE_CATALOG = {
  "Rent": [
    "Monthly shop rent",
    "Godown rent payment",
    "Parking space rent",
  ],
  "Utilities": [
    "NEA electricity bill",
    "Internet (Worldlink)",
    "Water supply bill",
    "Telephone bill",
    "KHANEPANI bill",
  ],
  "Supplies": [
    "Packaging materials",
    "Shopping bags purchase",
    "Receipt books",
    "Cleaning supplies",
    "Office stationery",
    "Printer ink cartridge",
    "Calculator batteries",
  ],
  "Transport": [
    "Delivery fuel cost",
    "Goods pickup from supplier",
    "Tempo hire for stock",
    "Bike maintenance",
    "Delivery charges paid",
  ],
  "Salary": [
    "Staff salary - monthly",
    "Helper daily wage",
    "Delivery boy payment",
    "Accountant salary",
    "Night guard payment",
  ],
  "Maintenance": [
    "AC servicing",
    "Refrigerator repair",
    "Shop renovation work",
    "Electrical repair",
    "Plumbing work",
    "Signboard repair",
  ],
  "Taxes & Fees": [
    "VAT payment",
    "Business renewal fee",
    "Ward tax payment",
    "PAN renewal charges",
  ],
  "Marketing": [
    "Pamphlet printing",
    "Banner/Flex printing",
    "Facebook ads",
    "Newspaper advertisement",
  ],
  "Miscellaneous": [
    "Tea/snacks for staff",
    "Customer refreshments",
    "Festival decoration",
    "Donation - local event",
    "Tips and small expenses",
  ],
};

export async function seedExpenses(
  shopId: string,
  count = 60 // More expenses over 3 months
) {
  const expenses = [];
  const categories = Object.keys(EXPENSE_CATALOG);

  // Distribute expenses across all 90 days
  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories);
    const descriptions = EXPENSE_CATALOG[category as keyof typeof EXPENSE_CATALOG];
    const description = faker.helpers.arrayElement(descriptions);

    // Amount ranges based on category (in NPR)
    const amountRanges: Record<string, { min: number; max: number }> = {
      "Rent": { min: 15000, max: 50000 },
      "Utilities": { min: 500, max: 5000 },
      "Supplies": { min: 200, max: 3000 },
      "Transport": { min: 200, max: 2000 },
      "Salary": { min: 8000, max: 35000 },
      "Maintenance": { min: 500, max: 10000 },
      "Taxes & Fees": { min: 1000, max: 15000 },
      "Marketing": { min: 500, max: 8000 },
      "Miscellaneous": { min: 100, max: 2000 },
    };

    const range = amountRanges[category] || { min: 100, max: 5000 };
    const amount = faker.number.int(range);

    // Expenses spread evenly across 90 days
    const dayOffset = faker.number.int({ min: 0, max: 89 });
    const createdAt = getDateForDay(dayOffset);

    expenses.push({
      shopId,
      description,
      amount,
      date: createdAt, // Expense date same as creation
      category,
      // 2% chance expense is soft-deleted
      deleted: faker.datatype.boolean({ probability: 0.02 }),
      createdAt,
      updatedAt: createdAt,
    });
  }

  return await Expense.insertMany(expenses);
}
