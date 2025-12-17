// src/seed/inventory.seed.ts
import Inventory from "../models/inventory.models.ts";
import { faker } from "@faker-js/faker";

export async function seedInventory(shopId: string, products: any[]) {
  const inventory = products.map(product => ({
    shopId,
    productId: product._id,
    stock: faker.number.int({ min: 20, max: 200 }),
    reserved: faker.number.int({ min: 0, max: 10 }),
  }));

  return await Inventory.insertMany(inventory);
}
