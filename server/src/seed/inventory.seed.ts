// src/seed/inventory.seed.ts
import Inventory from "../models/inventory.models.ts";
import { faker } from "@faker-js/faker";
import { getDateForDay } from "./utils/dateHelpers.ts";

export async function seedInventory(shopId: string, products: any[]) {
  const inventory = products.map(product => {
    // Inventory created in first week (initial stock setup)
    const dayOffset = faker.number.int({ min: 0, max: 6 });
    const createdAt = getDateForDay(dayOffset);
    
    // Some products have low stock (for testing low stock alerts)
    const isLowStock = faker.datatype.boolean({ probability: 0.15 });
    const stock = isLowStock 
      ? faker.number.int({ min: 2, max: 10 })
      : faker.number.int({ min: 30, max: 250 });
    
    return {
      shopId,
      productId: product._id,
      stock,
      // 30% chance some stock is reserved (only if stock > 5)
      reserved: (stock > 5 && faker.datatype.boolean({ probability: 0.3 }))
        ? faker.number.int({ min: 1, max: Math.max(1, Math.min(10, Math.floor(stock * 0.2))) })
        : 0,
      createdAt,
      updatedAt: createdAt,
    };
  });

  return await Inventory.insertMany(inventory);
}
