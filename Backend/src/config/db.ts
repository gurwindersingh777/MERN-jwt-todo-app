import mongoose from "mongoose";
import { MONGODB_URI } from "../constants/env.js";

async function connectToDB() {
  try {
    const connectionInstance = await mongoose.connect(MONGODB_URI)
    console.log("MongoDB connection successfully. Host :", connectionInstance.connection.host);

  } catch (error) {
    console.log("Failed to connect MongoDB", error);
    process.exit(1)
  }
}

export default connectToDB;