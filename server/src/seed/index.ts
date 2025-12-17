// src/seed/index.ts
import mongoose from "mongoose";
import { connectToDB } from "../db/index.ts";

import { seedShops } from "./shops.seed.ts";
import { seedCustomers } from "./customers.seed.ts";
import { seedProducts } from "./products.seed.ts";
import { seedInventory } from "./inventory.seed.ts";
import { seedSales } from "./sales.seed.ts";
import { seedExpenses } from "./expenses.seed.ts";

async function seed() {
  await connectToDB();


  const [shop] = await seedShops(1);

  const clientId = "FAKE_CLIENT_ID"; // temp until auth exists

  const customers = await seedCustomers(shop._id, clientId);
  const products = await seedProducts(shop._id, clientId);

  await seedInventory(shop._id, products);
  await seedSales(shop._id, clientId, customers, products);
  await seedExpenses(shop._id, clientId);

  console.log("✅ Database seeded successfully");
}

seed().catch(err => {
  console.error(err);
});
