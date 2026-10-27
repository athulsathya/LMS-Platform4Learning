import mongoose from "mongoose";
import "dotenv/config";

const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`);

    console.log(`MongoDB Connection successfull`);
  } catch (error) {
    console.log("MongoDB connection failed", error);
  }
};

export default connectDb;
