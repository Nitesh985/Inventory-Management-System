// src/seed/category.seed.ts
import Category from "../models/category.models.ts";

const CATEGORIES = [
  { name: "Groceries", description: "Daily essentials, rice, lentils, oil, spices, and other food staples" },
  { name: "Beverages & Snacks", description: "Drinks, noodles, chips, biscuits, and other snack items" },
  { name: "Dairy", description: "Milk, butter, cheese, curd, and other dairy products" },
  { name: "Personal Care", description: "Soaps, shampoos, toothpaste, and hygiene products" },
  { name: "Household", description: "Cleaning supplies, detergents, and home essentials" },
  { name: "Stationery", description: "Paper, pens, notebooks, and office supplies" },
  { name: "Electronics", description: "Bulbs, chargers, cables, and small electronic accessories" },
  { name: "Clothing", description: "Garments, accessories, and textile products" },
  { name: "Health & Medicine", description: "OTC medicines, first-aid, and health supplements" },
  { name: "Hardware", description: "Tools, fasteners, paints, and building materials" },
];

export async function seedCategories() {
  const categories = CATEGORIES.map((cat) => ({
    name: cat.name,
    description: cat.description,
  }));

  const created = await Category.insertMany(categories);
  console.log(`📂 Created ${created.length} categories`);
  return created;
}
