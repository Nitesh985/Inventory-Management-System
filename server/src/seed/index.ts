// src/seed/index.ts
import { connectToDB } from "../db/index.ts";
import { seedShops, SHOP_IDS } from "./shops.seed.ts";
import { seedCustomers } from "./customers.seed.ts";
import { seedProducts } from "./products.seed.ts";
import { seedInventory } from "./inventory.seed.ts";
import { seedSales } from "./sales.seed.ts";
import { seedExpenses } from "./expenses.seed.ts";
import { seedSuppliers, assignSuppliersToShops } from "./supplier.seed.ts"
import { seedPayments } from "./payment.seed.ts";
import { seedCategories } from "./category.seed.ts";
import { seedBudgets } from "./budget.seed.ts";
import { seedCredits } from "./credit.seed.ts";
import { clearDatabase } from "./utils/clearDatabase.ts";
import { generateTestUserId } from "./users.seed.ts";
import { getDateRange, SEED_DAYS } from "./utils/dateHelpers.ts";


async function seed() {
  await connectToDB();
  await clearDatabase();

  const { start, end } = getDateRange();
  
  console.log("\n🌱 Starting database seed...\n");
  console.log(`📅 Data will span ${SEED_DAYS} days (3 months):`);
  console.log(`   From: ${start.toLocaleDateString()} (Day 0 - Setup)`);
  console.log(`   To:   ${end.toLocaleDateString()} (Day ${SEED_DAYS - 1} - Today)`);
  console.log("");
  
  // Show the IDs that will be used
  console.log("📋 Reference IDs:");
  console.log(`   Test User ID: ${generateTestUserId()}`);
  console.log(`   Shop 1 ID: ${SHOP_IDS[0]}`);
  console.log(`   Shop 2 ID: ${SHOP_IDS[1]}`);
  console.log("");
  
  console.log("⏳ Timeline:");
  console.log("   Week 1 (Day 0-6): Shops, Products, Suppliers, Inventory setup");
  console.log("   Month 1 (Day 0-29): Most customers added, sales begin");
  console.log("   Month 2 (Day 30-59): Business growth, more sales");
  console.log("   Month 3 (Day 60-89): Peak activity, most recent data");
  console.log("   Throughout: Expenses and payments");
  console.log("");

  // NOTE: Users are NOT seeded - they must register through the auth system
  console.log("⚠️  Note: Users are NOT seeded. Register through the auth system.");
  console.log("");

  const shops = await seedShops(2);

  // 1. Seed categories (global, not per-shop)
  const categories = await seedCategories();

  // 2. Seed suppliers ONCE (Day 0-1)
  const suppliers = await seedSuppliers(20);
  console.log(`📦 Created ${suppliers.length} suppliers`);
 
  // 3. Attach suppliers to shops (shared + unique)
  await assignSuppliersToShops(shops, suppliers);
  console.log("✓ Assigned suppliers to shops");

  for (const shop of shops){
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📦 Seeding data for: ${shop.name}`);
    console.log(`   Shop ID: ${shop._id}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // Get suppliers assigned to this shop
    const shopSuppliers = shop.supplierIds
      ? suppliers.filter(s =>
          shop.supplierIds.some((id: any) => id.equals(s._id))
        )
      : [];
    
    // Spread across 3 months: Customers
    const customers = await seedCustomers(shop._id.toString());
    console.log(`   ✓ ${customers.length} customers (throughout 3 months)`);
    
    // Week 1 mostly: Products (with category and supplier links)
    const products = await seedProducts(shop._id.toString(), categories, shopSuppliers);
    console.log(`   ✓ ${products.length} products (mostly Week 1)`);
  
    // Week 1: Inventory
    await seedInventory(shop._id.toString(), products);
    console.log(`   ✓ Inventory records created (Week 1)`);
    
    // Week 2 onwards: Sales (growth pattern)
    const sales = await seedSales(shop._id, customers, products);
    console.log(`   ✓ ${sales.length} sales records (Week 2 - Today)`);
    
    // Throughout: Expenses
    const expenses = await seedExpenses(shop._id.toString());
    console.log(`   ✓ ${expenses.length} expense records (throughout)`);
    
    // Payments linked to sales
    const payments = await seedPayments(shop._id, sales);
    console.log(`   ✓ ${payments.length} payment records`);

    // Budgets per shop
    const budgets = await seedBudgets(shop._id.toString());
    console.log(`   ✓ ${budgets.length} budget records`);

    // Credits per shop
    const credits = await seedCredits(shop._id, customers);
    console.log(`   ✓ ${credits.length} credit records (throughout 3 months)`);
  }

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ Database seeded successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n📝 To use in frontend:");
  console.log("   - The mockup middleware uses Shop ID: 000000000000000000000001");
  console.log("   - Register a new user through the auth system");
  console.log("   - Data spans 3 months for realistic dashboard metrics\n");
  
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
