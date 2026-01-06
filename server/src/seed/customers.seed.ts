// src/seed/customers.seed.ts
import Customer from "../models/customer.models.ts";
import { faker } from "@faker-js/faker";
import { getDateForDay } from "./utils/dateHelpers.ts";

const CUSTOMER_NOTES_POOL = Object.freeze([
  "Pays late",
  "Always pays on time",
  "Good customer",
  "Very regular",
  "Monthly payer",
  "Weekly buyer",
  "Avoid giving high credit",
  "Pays after reminder",
  "Trustworthy",
  "Old customer",
  "Relative of shop owner",
  "Lives nearby",
  "Bulk buyer",
  "Seasonal customer",
  "Slow payer",
  "Clear balance before month end",
  "Remind before festival",
  "Prefers UPI",
  "Prefers cash",
  "Asks for discount",
  "High credit risk",
  "Low credit risk",
]);

// Realistic Nepali names for customers
const NEPALI_NAMES = [
  "Ram Bahadur Thapa", "Sita Kumari Sharma", "Hari Prasad Adhikari",
  "Gita Devi Poudel", "Krishna Bahadur Rai", "Sarita Tamang",
  "Bishnu Maya Gurung", "Prakash Kumar Shrestha", "Anita Devi Karki",
  "Deepak Raj Bhandari", "Sunita Kumari Magar", "Rajesh Prasad Khatri",
  "Kamala Devi Chhetri", "Sunil Bahadur KC", "Prabha Kumari Pandey",
  "Dinesh Raj Sapkota", "Mina Devi Bhattarai", "Santosh Kumar Rijal",
  "Laxmi Maya Basnet", "Bikash Prasad Ghimire", "Renu Kumari Dahal",
  "Nabin Raj Regmi", "Sabina Devi Koirala", "Roshan Bahadur Thakuri"
];

// Nepali addresses
const NEPALI_ADDRESSES = [
  "Kalimati, Kathmandu", "Baneshwor, Kathmandu", "Lazimpat, Kathmandu",
  "Patan Dhoka, Lalitpur", "Jawalakhel, Lalitpur", "Bhaktapur Durbar Square",
  "Thamel, Kathmandu", "Balaju, Kathmandu", "Chabahil, Kathmandu",
  "Koteshwor, Kathmandu", "Maharajgunj, Kathmandu", "Kalanki, Kathmandu",
  "Gongabu, Kathmandu", "Bouddha, Kathmandu", "Swayambhu, Kathmandu",
  "Kuleshwor, Kathmandu", "Samakhusi, Kathmandu", "Kirtipur",
  "Jorpati, Kathmandu", "Sundhara, Kathmandu"
];

export async function seedCustomers(
  shopId: string,
  count = 20
) {
  const customers = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    // Get unique name
    let name = faker.helpers.arrayElement(NEPALI_NAMES);
    if (usedNames.has(name)) {
      name = faker.person.fullName(); // Fallback to faker if name already used
    }
    usedNames.add(name);

    // Customers are added throughout the 3 months, with more in the first month
    // 60% in first month, 25% in second month, 15% in third month
    const monthRoll = faker.number.float({ min: 0, max: 1 });
    let dayOffset: number;
    if (monthRoll < 0.6) {
      dayOffset = faker.number.int({ min: 0, max: 29 }); // First month
    } else if (monthRoll < 0.85) {
      dayOffset = faker.number.int({ min: 30, max: 59 }); // Second month
    } else {
      dayOffset = faker.number.int({ min: 60, max: 89 }); // Third month
    }
    const createdAt = getDateForDay(dayOffset);

    customers.push({
      shopId,
      name,
      
      // 85% chance phone exists (most customers have phone in Nepal)
      phone: faker.helpers.maybe(
        () => `98${faker.number.int({ min: 10000000, max: 99999999 })}`,
        { probability: 0.85 }
      ),

      // 40% chance email exists (lower for local shop customers)
      email: faker.helpers.maybe(
        () => faker.internet.email({ firstName: name.split(" ")[0] }),
        { probability: 0.4 }
      ),

      // 60% chance address exists
      address: faker.helpers.maybe(
        () => faker.helpers.arrayElement(NEPALI_ADDRESSES),
        { probability: 0.6 }
      ),

      // 35% chance notes exist
      notes: faker.helpers.maybe(() => {
        const noteCount = faker.number.int({ min: 1, max: 2 });
        return faker.helpers
          .shuffle([...CUSTOMER_NOTES_POOL])
          .slice(0, noteCount)
          .join(", ");
      }, { probability: 0.35 }),

      // 5% chance customer is soft-deleted
      deleted: faker.datatype.boolean({ probability: 0.05 }),
      
      createdAt,
      updatedAt: createdAt,
    });
  }

  return await Customer.insertMany(customers);
}
