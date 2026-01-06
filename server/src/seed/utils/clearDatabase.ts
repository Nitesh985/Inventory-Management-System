import Shop from "../../models/shop.models.ts";
import Customer from "../../models/customer.models.ts";
import Supplier from "../../models/supplier.models.ts";
import Product from "../../models/product.models.ts";
import Inventory from "../../models/inventory.models.ts";
import Sale from "../../models/sales.models.ts";
import Expense from "../../models/expense.models.ts";
import Payment from "../../models/payment.models.ts";



export async function clearDatabase() {
  console.log("🧹 Clearing database...");

  await Promise.all([
    Shop.deleteMany({}),
    Customer.deleteMany({}),
    Supplier.deleteMany({}),
    Product.deleteMany({}),
    Inventory.deleteMany({}),
    Sale.deleteMany({}),
    Expense.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  console.log("✅ Database cleared");
}
