import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectToDB } from "./db/index.ts";
import app from './app.ts'
import Customer from './models/customer.models.ts'
import Expense from './models/expense.models.ts'
import Inventory from './models/inventory.models.ts'
import Product from './models/product.models.ts'
import Sales from './models/sales.models.ts'
import Shop from './models/shop.models.ts'





// Connect to DB and start server
connectToDB()
  .then(async () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`The app is listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Connection to Mongodb failed ::", error);
  });

console.log("Hello");