import Sales from "../models/sales.models.ts";
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import { getDateForDay } from "./utils/dateHelpers.ts";

// Realistic sale notes
const SALE_NOTES = [
  "Customer requested delivery",
  "Urgent order",
  "Regular weekly purchase",
  "Bulk order - special discount applied",
  "Festival purchase",
  "Cash on delivery",
  "Paid in advance",
  "Customer will pick up tomorrow",
  "Partial payment received",
  "Credit extended as per request",
  "Return customer - loyal discount",
  "First-time customer",
  "Referred by existing customer",
  "Phone order",
  "Walk-in purchase",
];

export async function seedSales(
  shopId: Types.ObjectId,
  customers: any[],
  products: any[],
  count = 150 // More sales over 3 months
) {
  const sales = [];
  
  // Track invoice numbers per shop to ensure uniqueness
  let invoiceCounter = 1;

  // Distribute sales across 3 months (days 7-89, after initial setup week)
  // Sales start after first week and increase over time (business growth pattern)
  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);
    const itemCount = faker.number.int({ min: 1, max: 5 });

    const items = faker.helpers
      .arrayElements(products, itemCount)
      .map((product) => {
        const quantity = faker.number.int({ min: 1, max: 8 });
        const unitPrice = product.price;

        return {
          productId: product._id,
          productName: product.name,
          quantity,
          unitPrice,
          totalPrice: quantity * unitPrice,
        };
      });

    const grossAmount = items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    // 25% chance discount applies
    const discount =
      faker.datatype.boolean({ probability: 0.25 })
        ? faker.number.int({ min: 10, max: Math.min(500, Math.floor(grossAmount * 0.15)) })
        : 0;

    const totalAmount = grossAmount - discount;

    // More cash sales than credit (60-40 split)
    const paymentType = faker.helpers.weightedArrayElement([
      { value: "CASH", weight: 60 },
      { value: "CREDIT", weight: 40 },
    ]);

    // Sales distribution: fewer early, more recent (business growth)
    // Week 2: 10%, Month 1: 25%, Month 2: 30%, Month 3: 35%
    const salesRoll = faker.number.float({ min: 0, max: 1 });
    let dayOffset: number;
    if (salesRoll < 0.10) {
      dayOffset = faker.number.int({ min: 7, max: 13 }); // Week 2
    } else if (salesRoll < 0.35) {
      dayOffset = faker.number.int({ min: 14, max: 29 }); // Rest of Month 1
    } else if (salesRoll < 0.65) {
      dayOffset = faker.number.int({ min: 30, max: 59 }); // Month 2
    } else {
      dayOffset = faker.number.int({ min: 60, max: 89 }); // Month 3 (most recent)
    }
    
    const createdAt = getDateForDay(dayOffset);
    const shopIdStr = shopId.toString().slice(-4);

    sales.push({
      shopId,
      customerId: customer._id,
      invoiceNo: `INV-${shopIdStr}-${String(invoiceCounter++).padStart(5, "0")}`,
      items,
      totalAmount,
      discount,
      paymentType,
      // 40% chance of having notes
      notes: faker.helpers.maybe(
        () => faker.helpers.arrayElement(SALE_NOTES),
        { probability: 0.4 }
      ),
      createdAt,
      updatedAt: createdAt,
    });
  }

  return await Sales.insertMany(sales);
}
