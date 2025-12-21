// src/seed/products.seed.ts
import Product from "../models/product.models.ts";
import { faker } from "@faker-js/faker";

export async function seedProducts(
  shopId: string,
  count = 30
) {
  const products = [];

  for (let i = 0; i < count; i++) {
    const cost = faker.number.int({ min: 50, max: 500 });
    const price = cost + faker.number.int({ min: 20, max: 200 });

    products.push({
      shopId,
      sku: faker.string.alphanumeric(8).toUpperCase(),
      name: faker.commerce.productName(),
      category: faker.commerce.department(),
      unit: faker.number.int({ min: 1, max: 10 }),
      cost,
      price,
      reorderLevel: faker.number.int({ min: 5, max: 20 }),
    });
  }

  return await Product.insertMany(products);
}
