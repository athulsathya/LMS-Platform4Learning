// import mongoose from "mongoose";
// import "dotenv/config";

// const connectDb = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("MongoDB Connection successful");
//   } catch (error) {
//     console.log("MongoDB connection failed", error);
//   }
// };

// export default connectDb;

// import mongoose from "mongoose";
// import "dotenv/config";

// const connectDb = async () => {
//   try {
//     if (mongoose.connection.readyState === 1) {
//       return;
//     }

//     await mongoose.connect(process.env.MONGO_URI);

//     console.log("MongoDB Connection successful");
//   } catch (error) {
//     console.error("MongoDB connection failed:", error.message);
//     throw error;
//   }
// };

// export default connectDb;

import mongoose from "mongoose";
import "dotenv/config";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

const connectDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing from environment variables");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connection successful");
    return cached.conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default connectDb;
