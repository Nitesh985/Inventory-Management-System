import express from 'express';
import { Types } from 'mongoose'
import cors from 'cors';
import 'dotenv/config';
import { connectToDB } from './db/index.ts';
import app from './app.ts';
import mongoose from 'mongoose'
import Sale from './models/sales.models.ts';
import Product from './models/product.models.ts';







connectToDB()
.then(async()=>{
  const shopObjectId = new mongoose.Types.ObjectId('000000000000000000000001');
  
  const totalSalesResult = await Sale.aggregate([
    {
      $match: {
        shopId: shopObjectId
      }
    },
    {
      $group: {
        _id: null,
        totalSales: { $sum: "$totalAmount" }
      }
    }
  ]);
  
  const totalSales =
    totalSalesResult.length > 0 ? totalSalesResult[0].totalSales : 0;

  console.log(totalSales)
})
  .then(async()=>{
 

  })
  .then(async () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`The app is listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log('Connection to Mongodb failed ::', error);
  });
