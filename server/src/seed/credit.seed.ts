// src/seed/credit.seed.ts
import Credit from "../models/credit.models.ts";
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import { getDateForDay } from "./utils/dateHelpers.ts";

/**
 * Create Credit records from actual credit sales (status === CREDIT).
 * Also generates some PAYMENT records against those credits.
 */
export async function seedCredits(
  shopId: Types.ObjectId,
  customers: any[],
  sales: any[]
) {
  const credits: any[] = [];

  // 1. Create CREDIT records from actual credit sales
  const creditSales = sales.filter((s) => s.status === "CREDIT");

  for (const sale of creditSales) {
    const creditAmount = sale.totalAmount - (sale.discount || 0) - (sale.paidAmount || 0);
    if (creditAmount <= 0) continue;

    credits.push({
      shopId,
      customerId: sale.customerId,
      saleId: sale._id,
      type: "CREDIT",
      amount: creditAmount,
      description: `Credit Sale - Invoice #${sale.invoiceNo}`,
      date: sale.createdAt,
      deleted: false,
      createdAt: sale.createdAt,
      updatedAt: sale.createdAt,
    });
  }

  // 2. Create PAYMENT records for ~50% of the credit customers (partial/full repayments)
  // Group credits by customer
  const creditsByCustomer = new Map<string, any[]>();
  for (const credit of credits) {
    const key = credit.customerId.toString();
    if (!creditsByCustomer.has(key)) {
      creditsByCustomer.set(key, []);
    }
    creditsByCustomer.get(key)!.push(credit);
  }

  for (const [customerId, customerCredits] of creditsByCustomer) {
    // 50% chance the customer has made some payment
    if (!faker.datatype.boolean({ probability: 0.5 })) continue;

    const totalOwed = customerCredits.reduce((sum: number, c: any) => sum + c.amount, 0);
    const lastCreditDate = new Date(
      Math.max(...customerCredits.map((c: any) => new Date(c.date).getTime()))
    );

    // Payment happens 1-14 days after the last credit
    const paymentDate = new Date(lastCreditDate);
    paymentDate.setDate(paymentDate.getDate() + faker.number.int({ min: 1, max: 14 }));

    // Don't create payments in the future
    if (paymentDate > new Date()) continue;

    const paymentCount = faker.number.int({ min: 1, max: 3 });

    let remainingOwed = totalOwed;
    for (let i = 0; i < paymentCount && remainingOwed > 0; i++) {
      // Last payment pays off remaining, others are partial
      const isLastPayment = i === paymentCount - 1;
      const paymentAmount = isLastPayment && faker.datatype.boolean({ probability: 0.3 })
        ? remainingOwed // Full settlement
        : faker.number.int({
            min: Math.floor(remainingOwed * 0.15),
            max: Math.floor(remainingOwed * 0.7),
          });

      if (paymentAmount <= 0) break;

      const method = faker.helpers.weightedArrayElement([
        { value: "CASH", weight: 55 },
        { value: "ESEWA", weight: 25 },
        { value: "KHALTI", weight: 20 },
      ]);

      const pDate = new Date(paymentDate);
      pDate.setDate(pDate.getDate() + i * faker.number.int({ min: 2, max: 10 }));
      if (pDate > new Date()) break;

      credits.push({
        shopId,
        customerId: new Types.ObjectId(customerId),
        type: "PAYMENT",
        amount: paymentAmount,
        description: `Payment received via ${method}`,
        paymentMethod: method,
        date: pDate,
        deleted: false,
        createdAt: pDate,
        updatedAt: pDate,
      });

      remainingOwed -= paymentAmount;
    }
  }

  if (credits.length === 0) return [];
  return await Credit.insertMany(credits);
}
