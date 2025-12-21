// src/seed/customers.seed.ts
import Customer from "../models/customer.models.ts";
import { faker } from "@faker-js/faker";

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


export async function seedCustomers(
  shopId: string,
  count = 20
) {
  const customers = [];

  for (let i = 0; i < count; i++) {
    customers.push({
      shopId,

      name: faker.person.fullName(),
      phone: faker.phone.number(),

      // 60% chance email exists
      email: faker.helpers.maybe(
        () => faker.internet.email(),
        { probability: 0.6 }
      ),

      // 50% chance address exists
      address: faker.helpers.maybe(
        () => faker.location.streetAddress(),
        { probability: 0.5 }
      ),

      // 30% chance notes exist
      notes: faker.helpers.maybe(() => {
        const count = faker.number.int({ min: 1, max: 2 });
        return faker.helpers
          .shuffle(CUSTOMER_NOTES_POOL)
          .slice(0, count)
          .join(", ");
      }, { probability: 0.35 }),


      // 5% chance customer is deleted
      deleted: faker.datatype.boolean({ probability: 0.05 }),
    });
  }

  return await Customer.insertMany(customers);
}
