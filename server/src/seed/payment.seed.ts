import Payment from "../models/payment.models.ts";
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import { getDateForDay } from "./utils/dateHelpers.ts";

const PAYMENT_METHODS = [
  "CASH",
  "ESEWA",
  "KHALTI",
  "FONEPAY",
  "BANK_TRANSFER",
  "CARD",
] as const;

// Payment method weights (CASH is most common in Nepal)
const PAYMENT_METHOD_WEIGHTS = [
  { value: "CASH", weight: 45 },
  { value: "ESEWA", weight: 20 },
  { value: "KHALTI", weight: 15 },
  { value: "FONEPAY", weight: 10 },
  { value: "BANK_TRANSFER", weight: 7 },
  { value: "CARD", weight: 3 },
] as const;

// Realistic payment notes
const CUSTOMER_PAYMENT_NOTES = [
  "Partial credit clearance",
  "Full balance paid",
  "Advance for next order",
  "Weekly payment",
  "Festival season payment",
  "Monthly credit settlement",
  "Urgent payment received",
  null, // No note
];

const SUPPLIER_PAYMENT_NOTES = [
  "Stock payment - invoice #",
  "Advance for next delivery",
  "Monthly settlement",
  "Partial payment",
  "Full invoice cleared",
  "COD payment",
  null, // No note
];

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

  // 🔹 Customer payments (money received) - Days 3-6
  for (const customer of customers) {
    // 55% customers make at least one payment
    if (faker.datatype.boolean({ probability: 0.55 })) {
      const paymentCount = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < paymentCount; i++) {
        const method = faker.helpers.weightedArrayElement(PAYMENT_METHOD_WEIGHTS);
        
        // Payments happen throughout the 3 months (after first week)
        const dayOffset = faker.number.int({ min: 7, max: 89 });
        const createdAt = getDateForDay(dayOffset);

        // Note based on payment method
        let note = null;
        if (faker.datatype.boolean({ probability: 0.5 })) {
          if (method === "CASH") {
            note = faker.helpers.arrayElement(["Cash received", "Counter payment", null]);
          } else {
            note = `Paid via ${method}` + (faker.datatype.boolean({ probability: 0.3 }) 
              ? ` - Txn: ${faker.string.alphanumeric(10).toUpperCase()}` 
              : "");
          }
        }

        payments.push({
          shopId,
          partyType: "CUSTOMER",
          partyId: customer._id,
          amount: faker.number.int({ min: 500, max: 8000 }),
          method,
          note,
          createdAt,
          updatedAt: createdAt,
        });
      }
    }
  }

  // 🔹 Supplier payments (money paid out) - Days 2-6
  for (const supplier of suppliers) {
    // 45% suppliers receive payments
    if (faker.datatype.boolean({ probability: 0.45 })) {
      const paymentCount = faker.number.int({ min: 1, max: 2 });

      for (let i = 0; i < paymentCount; i++) {
        // Suppliers more likely to receive bank transfer or cash
        const method = faker.helpers.weightedArrayElement([
          { value: "CASH", weight: 40 },
          { value: "BANK_TRANSFER", weight: 35 },
          { value: "FONEPAY", weight: 10 },
          { value: "ESEWA", weight: 8 },
          { value: "KHALTI", weight: 5 },
          { value: "CARD", weight: 2 },
        ]);

        // Supplier payments throughout 3 months
        const dayOffset = faker.number.int({ min: 7, max: 89 });
        const createdAt = getDateForDay(dayOffset);

        // Note for supplier payment
        let note = null;
        if (faker.datatype.boolean({ probability: 0.6 })) {
          const noteBase = faker.helpers.arrayElement(SUPPLIER_PAYMENT_NOTES);
          note = noteBase?.includes("#") 
            ? noteBase + faker.number.int({ min: 1000, max: 9999 })
            : noteBase;
        }

        payments.push({
          shopId,
          partyType: "SUPPLIER",
          partyId: supplier._id,
          amount: faker.number.int({ min: 2000, max: 25000 }),
          method,
          note,
          createdAt,
          updatedAt: createdAt,
        });
      }
    }
  }

  return await Payment.insertMany(payments);
}
