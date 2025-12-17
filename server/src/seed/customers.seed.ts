// src/seed/customers.seed.ts
import Customer from "../models/customer.models.ts";
import { faker } from "@faker-js/faker";

export async function seedCustomers(
  shopId: string,
  clientId: string,
  count = 20
) {
  const customers = [];

  for (let i = 0; i < count; i++) {
    customers.push({
      shopId,
      clientId,
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      address: faker.location.streetAddress(),
      outstandingBalance: 0,
    });
  }

  return await Customer.insertMany(customers);
}
