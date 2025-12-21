// src/seed/index.ts
import { connectToDB } from "../db/index.ts";
import { seedShops } from "./shops.seed.ts";
import { seedCustomers } from "./customers.seed.ts";
import { seedProducts } from "./products.seed.ts";
import { seedInventory } from "./inventory.seed.ts";
import { seedSales } from "./sales.seed.ts";
import { seedExpenses } from "./expenses.seed.ts";
import { seedSuppliers, assignSuppliersToShops } from "./supplier.seed.ts"
import { seedPayments } from "./payment.seed.ts";
import { clearDatabase } from "../helpers/clearDatabase.ts";






async function seed() {
  await connectToDB();
  await clearDatabase();

  const shops = await seedShops(2);

  // 1️⃣ Seed suppliers ONCE
   const suppliers = await seedSuppliers(20);
 
   // 2️⃣ Attach suppliers to shops (shared + unique)
   await assignSuppliersToShops(shops, suppliers);

  for (const shop of shops){
    const customers = await seedCustomers(shop._id);
    const products = await seedProducts(shop._id);
  
    await seedInventory(shop._id, products);
    await seedSales(shop._id, customers, products);
    await seedExpenses(shop._id);
    
    await seedPayments({
          shopId: shop._id,
          customers,
          suppliers: shop.supplierIds
            ? suppliers.filter(s =>
                shop.supplierIds.some(id => id.equals(s._id))
              )
            : [],
        });
  }


  console.log("✅ Database seeded successfully");
}

seed().catch((err) => {
  console.error(err);
});
