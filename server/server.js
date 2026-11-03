import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import connectDb from "./config/db.js";
import courseRouter from "./routes/courseRouter.js";
import bookingRouter from "./routes/bookingRouter.js";

// LOAD .env
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MIDDLEWARE
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

connectDb();

app.use(clerkMiddleware());

app.use("/uploads", express.static("uploads"));

// ROUTE
app.use("/api/course", courseRouter);
app.use("/api/booking", bookingRouter);

// APP PORT AND LISTEN
app.get("/", (req, res) => {
  res.send("LMS Backend is running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
