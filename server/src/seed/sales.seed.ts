import Sales from "../models/sales.models.ts";
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";

export async function seedSales(
  shopId: Types.ObjectId,
  customers: any[],
  products: any[],
  count = 40
) {
  const sales = [];

  for (let i = 0; i < count; i++) {
    const customer = faker.helpers.arrayElement(customers);

    const itemCount = faker.number.int({ min: 1, max: 4 });

    const items = faker.helpers
      .arrayElements(products, itemCount)
      .map((product) => {
        const quantity = faker.number.int({ min: 1, max: 5 });
        const unitPrice = product.price;

        return {
          productId: product._id,
          productName: product.name,
          quantity,
          unitPrice,
          totalPrice: quantity * unitPrice, // ✅ server-calculated
        };
      });

    const grossAmount = items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    // 30% chance discount applies
    const discount =
      faker.datatype.boolean({ probability: 0.3 })
        ? faker.number.int({ min: 10, max: Math.min(100, grossAmount) })
        : 0;

    const totalAmount = grossAmount - discount;

    // 50% credit, 50% cash
    const paymentType = faker.helpers.arrayElement([
      "CASH",
      "CREDIT",
    ]);

    sales.push({
      shopId,
      customerId: customer._id,
      invoiceNo: `INV-${shopId.toString().slice(-4)}-${Date.now()}-${i}`,
      items,
      totalAmount,
      discount,
      paymentType,
      notes: faker.helpers.maybe(
        () => faker.lorem.sentence(),
        { probability: 0.4 } // 40% of sales have notes
      )
    });
  }

  return await Sales.insertMany(sales);
}
