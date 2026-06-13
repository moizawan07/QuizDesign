import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { seedMockData } from "./config/seeder.js";
import mongoose from "mongoose";

dotenv.config();

async function run() {
  try {
    console.log("Starting seed script...");
    await connectDB();
    await seedMockData();
    console.log("Seeding process successfully completed!");
    await mongoose.disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
}

run();
