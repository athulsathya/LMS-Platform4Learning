import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { clerkMiddleware } from "@clerk/express";

import connectDb from "./config/db.js";
import courseRouter from "./routes/courseRouter.js";
import bookingRouter from "./routes/bookingRouter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "https://lms-platform4-learningfrontend.vercel.app",
      process.env.ADMIN_URL || "http://localhost:5174",
    ],
    credentials: true,
  }),
);

// Serve uploaded files
const uploadDir = process.env.VERCEL
  ? "/tmp/uploads"
  : path.join(process.cwd(), "uploads");

app.use("/uploads", express.static(uploadDir));

// Database connection

connectDb();

app.use(clerkMiddleware());

// Routes
app.use("/api/course", courseRouter);
app.use("/api/booking", bookingRouter);

app.get("/", (req, res) => {
  res.send("LMS Backend is running");
});

// Start server locally, but not on Vercel
if (!process.env.VERCEL) {
  app.listen(process.env.PORT || 4000, () => {
    console.log(`Server running on port ${process.env.PORT || 4000}`);
  });
}

// Vercel serverless export
export default app;
