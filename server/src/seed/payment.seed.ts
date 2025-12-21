import Payment from "../models/payment.models.ts";
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";

const PAYMENT_METHODS = [
  "CASH",
  "ESEWA",
  "KHALTI",
  "FONEPAY",
  "BANK_TRANSFER",
  "CARD",
] as const;

export async function seedPayments({
  shopId,
  customers = [],
  suppliers = [],
}: {
  shopId: Types.ObjectId;
  customers: any[];
  suppliers: any[];
}) {
  const payments = [];

  // 🔹 Customer payments (money received)
  for (const customer of customers) {
    // 60% customers make at least one payment
    if (faker.datatype.boolean({ probability: 0.6 })) {
      const paymentCount = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < paymentCount; i++) {
        const method = faker.helpers.arrayElement(PAYMENT_METHODS);

        payments.push({
          shopId,
          partyType: "CUSTOMER",
          partyId: customer._id,
          amount: faker.number.int({ min: 200, max: 3000 }),
          method,
          note:
            method !== "CASH"
              ? `Paid via ${method}`
              : null,
          createdAt: faker.date.recent({ days: 30 }),
        });
      }
    }
  }

  // 🔹 Supplier payments (money paid out)
  for (const supplier of suppliers) {
    // 50% suppliers receive payments
    if (faker.datatype.boolean({ probability: 0.5 })) {
      const paymentCount = faker.number.int({ min: 1, max: 2 });

      for (let i = 0; i < paymentCount; i++) {
        const method = faker.helpers.arrayElement(PAYMENT_METHODS);

        payments.push({
          shopId,
          partyType: "SUPPLIER",
          partyId: supplier._id,
          amount: faker.number.int({ min: 500, max: 5000 }),
          method,
          note:
            method !== "CASH"
              ? `Paid via ${method}`
              : null,
          createdAt: faker.date.recent({ days: 45 }),
        });
      }
    }
  }

  return await Payment.insertMany(payments);
}
