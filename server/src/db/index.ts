import mongoose from "mongoose";
import "dotenv/config";
import { DB_NAME } from "../constants.ts";

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    );
    if (connection) {
      console.log("Mongodb connected successfully");
    }
    return connection;
  } catch (error) {
    throw error;
  }
};

export { connectToDB };