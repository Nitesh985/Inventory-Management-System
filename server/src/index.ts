import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectToDB } from "./db/index.ts";
import app from './app.ts'
import Shop from './models/shop.models.ts'



connectToDB()
  // .then(async()=>{
  //   const findShop = await Shop.find()
  //   console.log(findShop)
  // })
  .then(async () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`The app is listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Connection to Mongodb failed ::", error);
  });

