import Supplier from "../models/supplier.models.ts";
import { faker } from "@faker-js/faker";

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
]);

export async function assignSuppliersToShops(
  shops,
  suppliers
) {
  for (const shop of shops) {
    // Each shop gets 3–7 suppliers
    const supplierCount = faker.number.int({ min: 3, max: 7 });

    const selectedSuppliers = faker.helpers
      .shuffle(suppliers)
      .slice(0, supplierCount)
      .map(s => s._id);

    shop.supplierIds = selectedSuppliers;
    await shop.save();
  }
}

export async function seedSuppliers(count = 15) {
  const suppliers = [];

  for (let i = 0; i < count; i++) {
    suppliers.push({
      name: faker.company.name(),

      phone: faker.helpers.maybe(
        () => faker.phone.number(),
        { probability: 0.6 }
      ),

      email: faker.helpers.maybe(
        () => faker.internet.email(),
        { probability: 0.5 }
      ),

      address: faker.helpers.maybe(
        () => faker.location.streetAddress(),
        { probability: 0.4 }
      ),

      notes: faker.helpers.maybe(() => {
        const count = faker.number.int({ min: 1, max: 2 });
        return faker.helpers
          .shuffle(SUPPLIER_NOTES_POOL)
          .slice(0, count)
          .join(", ");
      }, { probability: 0.4 }),

      deleted: faker.datatype.boolean({ probability: 0.03 }),
    });
  }

  return await Supplier.insertMany(suppliers);
}
