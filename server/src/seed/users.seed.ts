// src/seed/users.seed.ts
import { faker } from "@faker-js/faker";
import mongoose from "mongoose";

// We'll create a test user in the better-auth database
// For now, we just generate a consistent ObjectId to use as ownerId
export function generateTestUserId() {
  // Use a consistent ObjectId for the test user
  return new mongoose.Types.ObjectId("000000000000000000000100");
}

export async function seedUsers() {
  const testUserId = generateTestUserId();
  
  console.log(`📝 Test User ID: ${testUserId}`);
  console.log("Note: You'll need to create this user through the auth system (sign up)");
  
  return [{ _id: testUserId }];
}
