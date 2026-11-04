
import mongoose from "mongoose";
import "dotenv/config";

const connectDb = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return;
    }

    if (mongoose.connection.readyState === 2) {
      await mongoose.connection.asPromise();
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connection successful");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDb;
