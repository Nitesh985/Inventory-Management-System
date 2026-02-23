// src/seed/credit.seed.ts
import Credit from "../models/credit.models.ts";
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import { getDateForDay } from "./utils/dateHelpers.ts";

const CREDIT_DESCRIPTIONS = [
  "Purchased goods on credit",
  "Monthly grocery credit",
  "Festival season purchase",
  "Bulk order credit",
  "Regular customer credit",
  "Urgent purchase on credit",
  "Partial payment received",
  "Full payment received",
  "Weekly settlement",
  "Cash payment against credit",
  "eSewa payment received",
  "Khalti payment received",
  "Advance payment",
  "Credit extended for loyal customer",
  "Balance carried forward",
];

export async function seedCredits(
  shopId: Types.ObjectId,
  customers: any[],
  count = 80
) {
  const credits = [];

  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);

    // 60% are credit given (positive), 40% are payments received (negative)
    const isCreditGiven = faker.datatype.boolean({ probability: 0.6 });
    const amount = isCreditGiven
      ? faker.number.int({ min: 200, max: 8000 })
      : -faker.number.int({ min: 200, max: 6000 });

    const description = isCreditGiven
      ? faker.helpers.arrayElement(CREDIT_DESCRIPTIONS.slice(0, 6))
      : faker.helpers.arrayElement(CREDIT_DESCRIPTIONS.slice(6));

    // Spread across the 3-month period, more recent credits
    const creditRoll = faker.number.float({ min: 0, max: 1 });
    let dayOffset: number;
    if (creditRoll < 0.2) {
      dayOffset = faker.number.int({ min: 7, max: 29 });
    } else if (creditRoll < 0.5) {
      dayOffset = faker.number.int({ min: 30, max: 59 });
    } else {
      dayOffset = faker.number.int({ min: 60, max: 89 });
    }

    const createdAt = getDateForDay(dayOffset);

    credits.push({
      shopId,
      customerId: customer._id,
      amount,
      description,
      date: createdAt,
      deleted: faker.datatype.boolean({ probability: 0.02 }),
      createdAt,
      updatedAt: createdAt,
    });
  }

  return await Credit.insertMany(credits);
}
