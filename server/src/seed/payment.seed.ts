import Payment from "../models/payment.models.ts";
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";

/**
 * Create payment records linked to sales that have been paid (COMPLETED or PARTIALLY_PAID).
 * Payment model: { shopId, salesId, amount, method (CASH|ESEWA|KHALTI) }
 */
export async function seedPayments(
  shopId: Types.ObjectId,
  sales: any[]
) {
  const payments = [];

  for (const sale of sales) {
    // Only create payments for sales that have some payment
    if (sale.paidAmount <= 0) continue;

    const method = faker.helpers.weightedArrayElement([
      { value: "CASH" as const, weight: 60 },
      { value: "ESEWA" as const, weight: 25 },
      { value: "KHALTI" as const, weight: 15 },
    ]);

    const createdAt = new Date(sale.createdAt);
    // Payment usually same day or within a few hours of sale
    createdAt.setHours(
      createdAt.getHours() + faker.number.int({ min: 0, max: 4 })
    );

    // For partially paid sales, might have multiple payments
    if (sale.status === "PARTIALLY_PAID" && faker.datatype.boolean({ probability: 0.4 })) {
      // Split into 2 payments
      const firstAmount = Math.floor(sale.paidAmount * faker.number.float({ min: 0.3, max: 0.7 }));
      const secondAmount = sale.paidAmount - firstAmount;

      payments.push({
        shopId,
        salesId: sale._id,
        amount: firstAmount,
        method,
        createdAt,
        updatedAt: createdAt,
      });

      const laterDate = new Date(createdAt);
      laterDate.setDate(laterDate.getDate() + faker.number.int({ min: 1, max: 7 }));

      payments.push({
        shopId,
        salesId: sale._id,
        amount: secondAmount,
        method: faker.helpers.arrayElement(["CASH", "ESEWA", "KHALTI"] as const),
        createdAt: laterDate,
        updatedAt: laterDate,
      });
    } else {
      payments.push({
        shopId,
        salesId: sale._id,
        amount: sale.paidAmount,
        method,
        createdAt,
        updatedAt: createdAt,
      });
    }
  }

  return await Payment.insertMany(payments);
}
