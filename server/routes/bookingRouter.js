import {
  checkBooking,
  confirmPayment,
  createBooking,
  getBooking,
  getStats,
  getUserBooking,
} from "../controllers/bookingController.js";
import express from "express";

const bookingRouter = express.Router();

bookingRouter.get("/", getBooking);
bookingRouter.get("/stats", getStats);

bookingRouter.post("/create", createBooking);
bookingRouter.get("/check", checkBooking);
bookingRouter.get("/confirm", confirmPayment);

bookingRouter.get("/my", getUserBooking);

export default bookingRouter;
