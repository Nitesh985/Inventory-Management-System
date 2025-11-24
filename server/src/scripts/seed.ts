import mongoose from "mongoose";
import { faker } from "@faker-js/faker";

import User from "../models/user.models.ts";
import Shop from "../models/shop.models.ts";
import Product from "../models/product.models.ts";
import Inventory from "../models/inventory.models.ts";
import Customer from "../models/customer.models.ts";
import Sales from "../models/sales.models.ts";
import Expense from "../models/expense.models.ts";

const MONGO_URI = process.env.MONGODB_URI;

const generateUsers = (count: number, shopIds: string[]) => {
  return Array.from({ length: count }).map(() => ({
    _id: faker.database.mongodbObjectId(),
    shopid: faker.helpers.arrayElement(shopIds),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number("98########"),
    passwordHash: faker.string.alphanumeric(40),
    lastLoginAt: faker.date.recent({ days: 10 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));
};

const generateShops = (count: number) => {
  return Array.from({ length: count }).map(() => ({
    _id: faker.database.mongodbObjectId(),
    name: faker.company.name(),
    useBS: faker.datatype.boolean(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));
};

const generateProducts = (shopIds: string[], userIds: string[], count: number) => {
  const categories = ["Fruits", "Dairy", "Snacks", "Grains", "Electronics", "Cosmetics"];

  return Array.from({ length: count }).map(() => {
    const shopId = faker.helpers.arrayElement(shopIds);

    return {
      _id: faker.database.mongodbObjectId(),
      shopid: shopId,
      clientId: faker.helpers.arrayElement(userIds),
      sku: faker.string.alphanumeric(8),
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories),
      unit: faker.number.int({ min: 1, max: 10 }),
      price: faker.number.int({ min: 50, max: 5000 }),
      cost: faker.number.int({ min: 20, max: 3000 }),
      reorderLevel: faker.number.int({ min: 5, max: 50 }),
      deleted: false,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    };
  });
};

const generateInventory = (shopIds: string[], productIds: string[]) => {
  return productIds.map((productId) => ({
    _id: faker.database.mongodbObjectId(),
    shopId: faker.helpers.arrayElement(shopIds),
    productId,
    quantity: faker.number.int({ min: 0, max: 200 }),
    reserved: faker.number.int({ min: 0, max: 30 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));
};

const generateCustomers = (shopIds: string[], userIds: string[], count: number) => {
  return Array.from({ length: count }).map(() => ({
    _id: faker.database.mongodbObjectId(),
    shopId: faker.helpers.arrayElement(shopIds),
    clientId: faker.helpers.arrayElement(userIds),
    name: faker.person.fullName(),
    phone: faker.phone.number("98########"),
    address: faker.location.streetAddress(),
    outstandingBalance: faker.number.int({ min: 0, max: 5000 }),
    notes: faker.lorem.sentence(),
    deleted: false,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));
};

const generateSales = (shopIds: string[], userIds: string[], customerIds: string[], productList: any[], count: number) => {
  return Array.from({ length: count }).map(() => {
    const shopId = faker.helpers.arrayElement(shopIds);
    const customerId = faker.helpers.arrayElement(customerIds);

    const itemsCount = faker.number.int({ min: 1, max: 5 });

    const items = Array.from({ length: itemsCount }).map(() => {
      const product = faker.helpers.arrayElement(productList);

      return {
        productId: product._id,
        productName: product.name,
        quantity: faker.number.int({ min: 1, max: 10 }),
        unitPrice: product.price,
        totalPrice: product.price * faker.number.int({ min: 1, max: 10 }),
      };
    });

    const totalAmount = items.reduce((sum, i) => sum + i.totalPrice, 0);
    const paidAmount = faker.number.int({ min: 0, max: totalAmount });

    return {
      _id: faker.database.mongodbObjectId(),
      shopId,
      clientId: faker.helpers.arrayElement(userIds),
      customerId,
      invoiceNo: faker.string.uuid(),
      items,
      totalAmount,
      paidAmount,
      discount: faker.number.int({ min: 0, max: 200 }),
      notes: faker.lorem.sentence(),
      createdAt: faker.date.recent({ days: 50 }),
      updatedAt: faker.date.recent(),
    };
  });
};

const generateExpenses = (shopIds: string[], userIds: string[], count: number) => {
  return Array.from({ length: count }).map(() => ({
    _id: faker.database.mongodbObjectId(),
    shopId: faker.helpers.arrayElement(shopIds),
    clientId: faker.helpers.arrayElement(userIds),
    description: faker.commerce.productDescription(),
    amount: faker.number.int({ min: 100, max: 5000 }),
    category: faker.commerce.department(),
    date: faker.date.recent({ days: 60 }),
    deleted: false,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));
};

(async () => {

  // Clear all collections
  await User.deleteMany({});
  await Shop.deleteMany({});
  await Product.deleteMany({});
  await Inventory.deleteMany({});
  await Customer.deleteMany({});
  await Sales.deleteMany({});
  await Expense.deleteMany({});

  // Shops
  const shops = generateShops(4);
  await Shop.insertMany(shops);

  const shopIds = shops.map((s) => s._id);

  // Users
  const users = generateUsers(20, shopIds);
  await User.insertMany(users);

  const userIds = users.map((u) => u._id);

  // Products
  const products = generateProducts(shopIds, userIds, 200);
  await Product.insertMany(products);

  const productIds = products.map((p) => p._id);

  // Inventory
  const inventory = generateInventory(shopIds, productIds);
  await Inventory.insertMany(inventory);

  // Customers
  const customers = generateCustomers(shopIds, userIds, 50);
  await Customer.insertMany(customers);

  const customerIds = customers.map((c) => c._id);

  // Sales
  const sales = generateSales(shopIds, userIds, customerIds, products, 300);
  await Sales.insertMany(sales);

  // Expenses
  const expenses = generateExpenses(shopIds, userIds, 50);
  await Expense.insertMany(expenses);

  console.log("Database seeded successfully!");
  process.exit();
})();
