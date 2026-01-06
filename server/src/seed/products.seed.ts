// src/seed/products.seed.ts
import Product from "../models/product.models.ts";
import { faker } from "@faker-js/faker";
import { getDateForDay } from "./utils/dateHelpers.ts";

// Realistic Nepali shop products with categories
const PRODUCT_CATALOG = [
  // Groceries
  { name: "Basmati Rice (25kg)", category: "Groceries", minCost: 2000, maxCost: 2500 },
  { name: "Jeera Rice (5kg)", category: "Groceries", minCost: 400, maxCost: 600 },
  { name: "Tata Salt (1kg)", category: "Groceries", minCost: 20, maxCost: 30 },
  { name: "Sunflower Oil (1L)", category: "Groceries", minCost: 180, maxCost: 220 },
  { name: "Mustard Oil (1L)", category: "Groceries", minCost: 200, maxCost: 280 },
  { name: "Sugar (1kg)", category: "Groceries", minCost: 80, maxCost: 100 },
  { name: "Wheat Flour (10kg)", category: "Groceries", minCost: 450, maxCost: 550 },
  { name: "Red Lentils (1kg)", category: "Groceries", minCost: 120, maxCost: 160 },
  { name: "Chickpeas (1kg)", category: "Groceries", minCost: 100, maxCost: 140 },
  { name: "Turmeric Powder (200g)", category: "Groceries", minCost: 60, maxCost: 90 },
  
  // Beverages
  { name: "Wai Wai Noodles (Pack of 30)", category: "Beverages & Snacks", minCost: 450, maxCost: 550 },
  { name: "Coca Cola (2L)", category: "Beverages & Snacks", minCost: 100, maxCost: 130 },
  { name: "Real Juice (1L)", category: "Beverages & Snacks", minCost: 100, maxCost: 130 },
  { name: "Tokla Tea (500g)", category: "Beverages & Snacks", minCost: 200, maxCost: 280 },
  { name: "Nescafe Classic (200g)", category: "Beverages & Snacks", minCost: 350, maxCost: 450 },
  
  // Dairy
  { name: "DDC Milk (1L)", category: "Dairy", minCost: 85, maxCost: 100 },
  { name: "Amul Butter (500g)", category: "Dairy", minCost: 280, maxCost: 350 },
  { name: "Yak Cheese (500g)", category: "Dairy", minCost: 400, maxCost: 550 },
  { name: "Curd (500g)", category: "Dairy", minCost: 60, maxCost: 80 },
  
  // Personal Care
  { name: "Lifebuoy Soap (4 Pack)", category: "Personal Care", minCost: 120, maxCost: 160 },
  { name: "Dove Shampoo (400ml)", category: "Personal Care", minCost: 350, maxCost: 450 },
  { name: "Colgate Toothpaste (200g)", category: "Personal Care", minCost: 100, maxCost: 140 },
  { name: "Dettol Handwash (500ml)", category: "Personal Care", minCost: 180, maxCost: 250 },
  
  // Household
  { name: "Surf Excel (1kg)", category: "Household", minCost: 180, maxCost: 240 },
  { name: "Vim Bar (3 Pack)", category: "Household", minCost: 60, maxCost: 90 },
  { name: "Lizol Floor Cleaner (1L)", category: "Household", minCost: 180, maxCost: 250 },
  { name: "Garbage Bags (Pack of 50)", category: "Household", minCost: 100, maxCost: 150 },
  
  // Stationery
  { name: "A4 Paper Ream (500 sheets)", category: "Stationery", minCost: 400, maxCost: 550 },
  { name: "Ball Pen (Box of 50)", category: "Stationery", minCost: 200, maxCost: 300 },
  { name: "Notebook (Pack of 10)", category: "Stationery", minCost: 150, maxCost: 220 },
  
  // Electronics
  { name: "LED Bulb 9W", category: "Electronics", minCost: 80, maxCost: 120 },
  { name: "Extension Board (4 Socket)", category: "Electronics", minCost: 250, maxCost: 350 },
  { name: "USB Cable Type-C", category: "Electronics", minCost: 150, maxCost: 250 },
  { name: "Mobile Charger (Fast)", category: "Electronics", minCost: 300, maxCost: 500 },
  { name: "Earphones Basic", category: "Electronics", minCost: 150, maxCost: 300 },
];

export async function seedProducts(
  shopId: string,
  count = 30
) {
  const products = [];
  const usedProducts = new Set<string>();
  const productPool = [...PRODUCT_CATALOG];

  // Products are added on Day 0-1 (7-6 days ago) - setup phase
  for (let i = 0; i < count; i++) {
    let productData;
    
    // Use catalog products first, then generate random ones
    if (productPool.length > 0 && !usedProducts.has(productPool[0].name)) {
      const idx = faker.number.int({ min: 0, max: productPool.length - 1 });
      productData = productPool.splice(idx, 1)[0];
    } else {
      // Fallback to faker-generated product
      productData = {
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        minCost: 50,
        maxCost: 500,
      };
    }

    const cost = faker.number.int({ min: productData.minCost, max: productData.maxCost });
    const marginPercent = faker.number.int({ min: 10, max: 35 }); // 10-35% margin
    const price = Math.round(cost * (1 + marginPercent / 100));
    
    // Products mostly created in first week, some added later
    // 70% in first week, 20% in first month, 10% throughout
    const productRoll = faker.number.float({ min: 0, max: 1 });
    let dayOffset: number;
    if (productRoll < 0.7) {
      dayOffset = faker.number.int({ min: 0, max: 6 }); // First week
    } else if (productRoll < 0.9) {
      dayOffset = faker.number.int({ min: 7, max: 29 }); // Rest of first month
    } else {
      dayOffset = faker.number.int({ min: 30, max: 89 }); // Later additions
    }
    const createdAt = getDateForDay(dayOffset);

    products.push({
      shopId,
      
      // 80% chance SKU exists
      sku: faker.helpers.maybe(
        () => faker.string.alphanumeric(8).toUpperCase(),
        { probability: 0.8 }
      ),
      
      name: productData.name,
      category: productData.category,
      
      // 60% chance description exists
      description: faker.helpers.maybe(
        () => `High quality ${productData.name.toLowerCase()}. ${faker.commerce.productDescription()}`,
        { probability: 0.6 }
      ),
      
      unit: faker.number.int({ min: 1, max: 10 }),
      cost,
      price,
      reorderLevel: faker.number.int({ min: 5, max: 25 }),
      
      // 3% chance product is soft-deleted
      deleted: faker.datatype.boolean({ probability: 0.03 }),
      
      createdAt,
      updatedAt: createdAt,
    });
  }

  return await Product.insertMany(products);
}
