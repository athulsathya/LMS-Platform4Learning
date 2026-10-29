import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkMiddleware } from "@clerk/express";
import connectDb from "./config/db.js";
import courseRouter from "./routes/courseRouter.js";
import bookingRouter from "./routes/bookingRouter.js";

const app = express();
const port = 4000;

// LOAD .env
dotenv.config();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

app.use("/uploads", express.static("uploads"));

// ROUTE
app.use("/api/course", courseRouter);
app.use("/api/booking", bookingRouter);

// APP PORT AND LISTEN
app.get("/", (req, res) => {
  res.send("LMS Backend is running");
});

app.listen(port, () => {
  connectDb();
  console.log(`Server is running on http://localhost:${port}`);
});
