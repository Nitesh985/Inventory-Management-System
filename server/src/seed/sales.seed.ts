// src/seed/sales.seed.ts
import Sales from "../models/sales.models.ts";
import { faker } from "@faker-js/faker";

export async function seedSales(
  shopId: string,
  clientId: string,
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
      .map(product => {
        const quantity = faker.number.int({ min: 1, max: 5 });
        const unitPrice = product.price;

        return {
          productId: product._id,
          productName: product.name,
          quantity,
          unitPrice,
          totalPrice: quantity * unitPrice,
        };
      });

    const totalAmount = items.reduce(
      (sum, i) => sum + i.totalPrice,
      0
    );

    const paidAmount = faker.number.int({
      min: 0,
      max: totalAmount,
    });

    sales.push({
      shopId,
      clientId,
      customerId: customer._id,
      invoiceNo: `INV-${Date.now()}-${i}`,
      items,
      totalAmount,
      paidAmount,
      discount: 0,
      notes: faker.lorem.sentence(),
    });
  }

  return await Sales.insertMany(sales);
}
