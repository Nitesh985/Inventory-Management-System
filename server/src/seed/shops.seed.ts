// src/seed/shops.seed.ts
import Shop from "../models/shop.models.ts";
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";
import { generateTestUserId } from "./users.seed.ts";
import { getDateForDay } from "./utils/dateHelpers.ts";

// Generate consistent shop IDs so we can reference them in mockup middleware
const SHOP_IDS = [
  new mongoose.Types.ObjectId("000000000000000000000001"),
  new mongoose.Types.ObjectId("000000000000000000000002"),
];

// Realistic Nepali shop data
const SHOP_DATA = [
  {
    name: "Krishna General Store",
    businessType: "Retail Store" as const,
    address: "Kalimati, Kathmandu",
    city: "Kathmandu",
    district: "Kathmandu",
    province: "Bagmati Province",
  },
  {
    name: "Everest Electronics",
    businessType: "Retail Store" as const,
    address: "New Road, Kathmandu",
    city: "Kathmandu",
    district: "Kathmandu",
    province: "Bagmati Province",
  },
  {
    name: "Himalayan Health Clinic",
    businessType: "Healthcare" as const,
    address: "Lazimpat, Kathmandu",
    city: "Kathmandu",
    district: "Kathmandu",
    province: "Bagmati Province",
  },
  {
    name: "Namaste Restaurant",
    businessType: "Restaurant/Food" as const,
    address: "Thamel, Kathmandu",
    city: "Kathmandu",
    district: "Kathmandu",
    province: "Bagmati Province",
  },
];

export async function seedShops(count = 2) {
  const ownerId = generateTestUserId();
  const shops = [];

  // Shops created on Day 0 (90 days ago - business setup)
  const createdAt = getDateForDay(0);

  for (let i = 0; i < count; i++) {
    const shopData = SHOP_DATA[i] || {
      name: faker.company.name(),
      businessType: faker.helpers.arrayElement([
        "Retail Store", "Service Provider", "Manufacturing", 
        "Restaurant/Food", "Healthcare", "Other"
      ]),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      district: "Kathmandu",
      province: "Bagmati Province",
    };

    shops.push({
      _id: SHOP_IDS[i] || new mongoose.Types.ObjectId(),
      name: shopData.name,
      useBS: faker.datatype.boolean({ probability: 0.7 }), // 70% use BS calendar
      ownerId: ownerId,
      businessType: shopData.businessType,
      
      // Business Profile Fields (optional with random inclusion)
      panNumber: faker.helpers.maybe(
        () => faker.number.int({ min: 100000000, max: 999999999 }).toString(),
        { probability: 0.6 }
      ),
      vatNumber: faker.helpers.maybe(
        () => faker.number.int({ min: 100000000, max: 999999999 }).toString(),
        { probability: 0.3 }
      ),
      currency: "NPR",
      address: shopData.address,
      city: shopData.city,
      district: shopData.district,
      province: shopData.province,
      phone: faker.helpers.maybe(
        () => `01-${faker.number.int({ min: 4000000, max: 4999999 })}`,
        { probability: 0.8 }
      ),
      email: faker.helpers.maybe(
        () => faker.internet.email({ 
          firstName: shopData.name.split(" ")[0].toLowerCase(),
          provider: "gmail.com"
        }),
        { probability: 0.5 }
      ),
      logo: "", // No logo for seed data
      
      createdAt,
      updatedAt: createdAt,
    });
  }

  const createdShops = await Shop.insertMany(shops);
  
  console.log(`🏪 Created ${createdShops.length} shops`);
  console.log(`   Shop 1 ID: ${createdShops[0]._id} - ${createdShops[0].name}`);
  if (createdShops[1]) console.log(`   Shop 2 ID: ${createdShops[1]._id} - ${createdShops[1].name}`);
  
  return createdShops;
}

export { SHOP_IDS };
