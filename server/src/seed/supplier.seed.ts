import Supplier from "../models/supplier.models.ts";
import { faker } from "@faker-js/faker";
import { getDateForDay } from "./utils/dateHelpers.ts";

const SUPPLIER_NOTES_POOL = Object.freeze([
  "Gives credit",
  "Advance payment required",
  "Late delivery sometimes",
  "Reliable supplier",
  "Old supplier",
  "Local supplier",
  "Wholesale dealer",
  "Bulk discounts available",
  "Rates fluctuate",
  "Seasonal supply",
  "Prefers cash",
  "Prefers bank transfer",
  "Direct factory contact",
  "Good quality products",
  "Fast delivery",
  "Negotiable rates",
]);

// Realistic Nepali supplier/company names
const SUPPLIER_NAMES = [
  "Himalayan Distributors Pvt. Ltd.",
  "Kathmandu Trading Co.",
  "Everest Wholesale",
  "Bagmati Suppliers",
  "Nepal General Store",
  "Pokhara Trading House",
  "Lumbini Enterprises",
  "Sagarmatha Distributors",
  "Annapurna Traders",
  "Biratnagar Wholesale",
  "Bharatpur Trading Co.",
  "Lalitpur Suppliers",
  "Bhaktapur Enterprises",
  "Chitwan Distributors",
  "Butwal Trading House",
  "Dharan Wholesale Mart",
  "Birgunj Import Export",
  "Janakpur Traders",
  "Nepalgunj Suppliers",
  "Dhangadhi Enterprises",
  "Krishna Wholesale",
  "Shiva Trading Co.",
  "Ganesh Distributors",
  "Durga Enterprises",
  "Mahalaxmi Traders",
];

// Nepali city addresses for suppliers
const SUPPLIER_ADDRESSES = [
  "New Baneshwor, Kathmandu",
  "Kalimati, Kathmandu",
  "Ason, Kathmandu",
  "Patan Industrial Area, Lalitpur",
  "Bhaktapur Industrial Estate",
  "Balaju Industrial District",
  "Birgunj Industrial Corridor",
  "Biratnagar Industrial Area",
  "Pokhara Industrial Estate",
  "Hetauda Industrial District",
  "Butwal Industrial Zone",
  "Dharan Commercial Area",
  "Bharatpur Market",
  "Itahari Business Hub",
];

export async function assignSuppliersToShops(
  shops: any[],
  suppliers: any[]
) {
  for (const shop of shops) {
    // Each shop gets 4–8 suppliers
    const supplierCount = faker.number.int({ min: 4, max: 8 });

    const selectedSuppliers = faker.helpers
      .shuffle(suppliers)
      .slice(0, supplierCount)
      .map(s => s._id);

    shop.supplierIds = selectedSuppliers;
    await shop.save();
  }
}

export async function seedSuppliers(count = 20) {
  const suppliers = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    // Get unique name
    let name = SUPPLIER_NAMES[i] || faker.company.name();
    if (usedNames.has(name)) {
      name = faker.company.name() + " " + faker.location.city();
    }
    usedNames.add(name);

    // Suppliers mostly added in first week, some added later
    const supplierRoll = faker.number.float({ min: 0, max: 1 });
    let dayOffset: number;
    if (supplierRoll < 0.8) {
      dayOffset = faker.number.int({ min: 0, max: 6 }); // First week
    } else {
      dayOffset = faker.number.int({ min: 7, max: 45 }); // Added later
    }
    const createdAt = getDateForDay(dayOffset);

    suppliers.push({
      name,

      // 75% chance phone exists
      phone: faker.helpers.maybe(
        () => `98${faker.number.int({ min: 10000000, max: 99999999 })}`,
        { probability: 0.75 }
      ),

      // 55% chance email exists
      email: faker.helpers.maybe(
        () => faker.internet.email({ 
          firstName: name.split(" ")[0].toLowerCase(),
          provider: faker.helpers.arrayElement(["gmail.com", "yahoo.com", "outlook.com", "company.com.np"])
        }),
        { probability: 0.55 }
      ),

      // 65% chance address exists
      address: faker.helpers.maybe(
        () => faker.helpers.arrayElement(SUPPLIER_ADDRESSES),
        { probability: 0.65 }
      ),

      // 45% chance notes exist
      notes: faker.helpers.maybe(() => {
        const noteCount = faker.number.int({ min: 1, max: 3 });
        return faker.helpers
          .shuffle([...SUPPLIER_NOTES_POOL])
          .slice(0, noteCount)
          .join(", ");
      }, { probability: 0.45 }),

      // 3% chance supplier is soft-deleted
      deleted: faker.datatype.boolean({ probability: 0.03 }),
      
      createdAt,
      updatedAt: createdAt,
    });
  }

  return await Supplier.insertMany(suppliers);
}
