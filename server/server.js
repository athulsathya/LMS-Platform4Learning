
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { clerkMiddleware } from "@clerk/express";

import connectDb from "./config/db.js";
import courseRouter from "./routes/courseRouter.js";
import bookingRouter from "./routes/bookingRouter.js";

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://lms-platform4-learningfrontend.vercel.app",
  process.env.ADMIN_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Clerk middleware
app.use(clerkMiddleware());

// Connect to MongoDB before handling API requests
app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error("Database connection error:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Uploaded files
const uploadDir = process.env.VERCEL
  ? "/tmp/uploads"
  : path.join(process.cwd(), "uploads");

app.use("/uploads", express.static(uploadDir));

// Backend test
app.get("/", (req, res) => {
  res.send("LMS Backend is running");
});

// MongoDB connection test
app.get("/api/test-db", (req, res) => {
  const state = mongoose.connection.readyState;

  res.status(state === 1 ? 200 : 503).json({
    success: state === 1,
    message:
      state === 1
        ? "MongoDB Connected Successfully"
        : "MongoDB Not Connected",
    database: mongoose.connection.name,
    connectionState: state,
  });
});

// API routes
app.use("/api/course", courseRouter);
app.use("/api/booking", bookingRouter);

// Local server
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 4000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Vercel export
export default app;
