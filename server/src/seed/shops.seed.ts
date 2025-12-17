// src/seed/shops.seed.ts
import Shop from "../models/shop.models.ts";
import { faker } from "@faker-js/faker";

export async function seedShops(count = 2) {
  const shops = [];

  for (let i = 0; i < count; i++) {
    shops.push({
      name: faker.company.name(),
      useBS: faker.datatype.boolean(),
    });
  }

  return await Shop.insertMany(shops);
}
