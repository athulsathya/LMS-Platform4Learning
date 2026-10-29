import Booking from "../models/bookingModel.js";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";
import dotenv from "dotenv";

dotenv.config();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;

const stripe = STRIPE_KEY ? new Stripe(STRIPE_KEY) : null;

// Helper function
const safeNumber = (v) => {
  if (v === null || v === undefined || v === "") {
    return null;
  }

  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

// Generate booking ID
const genBookingId = () => {
  return `BK-${uuidv4()}`;
};

// Build frontend URL
function buildFrontendBase(req) {
  if (FRONTEND_URL) {
    return FRONTEND_URL.replace(/\/$/, "");
  }

  const origin = req.get("origin");

  if (origin) {
    return origin.replace(/\/$/, "");
  }

  return null;
}

// Escape special characters in search
const escapeRegex = (value) => {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Get all bookings
export const getBooking = async (req, res) => {
  try {
    const {
      search = "",
      status,
      limit: limitRaw = 50,
      page: pageRaw = 1,
    } = req.query;

    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 50));

    const page = Math.max(1, parseInt(pageRaw, 10) || 1);

    const skip = (page - 1) * limit;

    const filter = {};

    if (status) {
      filter.orderStatus = status;
    }

    if (search) {
      const re = new RegExp(escapeRegex(search), "i");

      filter.$or = [
        { bookingId: re },
        { courseName: re },
        { teacherName: re },
        { clerkUserId: re },
        { studentName: re },
      ];
    }

    const items = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      bookings: items,
      meta: {
        page,
        limit,
        count: items.length,
      },
    });
  } catch (err) {
    console.error("getBookings error:", err);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Check whether user is enrolled in a course
export const checkBooking = async (req, res) => {
  try {
    const { userId } = getAuth(req) || {};

    if (!userId) {
      return res.status(200).json({
        success: true,
        enrolled: false,
        booking: null,
      });
    }

    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID required",
      });
    }

    const booking = await Booking.findOne({
      course: courseId,
      clerkUserId: userId,
      paymentStatus: "Paid",
      orderStatus: "Confirmed",
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!booking) {
      return res.status(200).json({
        success: true,
        enrolled: false,
        booking: null,
      });
    }

    const enrolled =
      booking.paymentStatus === "Paid" && booking.orderStatus === "Confirmed";

    return res.status(200).json({
      success: true,
      enrolled,
      booking,
    });
  } catch (error) {
    console.error("checkBooking error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      courseId,
      courseName,
      teacherName = "",
      price,
      notes = "",
      email,
      studentName,
    } = req.body;

    if (!courseId || !courseName) {
      return res.status(400).json({
        success: false,
        message: "courseId and courseName required",
      });
    }

    const numericPrice = safeNumber(price);

    if (numericPrice === null || numericPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });
    }

    // Check if user already enrolled
    const existingBooking = await Booking.findOne({
      clerkUserId: userId,
      course: courseId,
      paymentStatus: "Paid",
      orderStatus: "Confirmed",
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "You are already enrolled in this course",
        booking: existingBooking,
      });
    }

    const bookingId = genBookingId();

    const resolvedStudentName =
      (studentName && String(studentName).trim()) ||
      (email && String(email).trim()) ||
      `User-${String(userId).slice(0, 8)}`;

    const basePayload = {
      bookingId,
      clerkUserId: userId,
      studentName: resolvedStudentName,
      course: courseId,
      courseName,
      teacherName,
      price: numericPrice,
      paymentMethod: "Online",
      paymentStatus: "Unpaid",
      notes,
      orderStatus: "Pending",
    };

    // Free course booking
    if (numericPrice === 0) {
      const booking = await Booking.create({
        ...basePayload,
        paymentStatus: "Paid",
        orderStatus: "Confirmed",
        paidAt: new Date(),
      });

      return res.status(201).json({
        success: true,
        booking,
        checkoutUrl: null,
      });
    }

    // Check Stripe configuration
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: "Stripe not configured on server",
      });
    }

    const base = buildFrontendBase(req);

    if (!base) {
      return res.status(500).json({
        success: false,
        message: "Frontend URL not determined",
      });
    }

    const successUrl = `${base}/booking/success?session_id={CHECKOUT_SESSION_ID}`;

    const cancelUrl = `${base}/booking/cancel`;

    let session;

    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",

        customer_email: email || undefined,

        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: courseName,
              },
              unit_amount: Math.round(numericPrice * 100),
            },
            quantity: 1,
          },
        ],

        success_url: successUrl,
        cancel_url: cancelUrl,

        metadata: {
          bookingId,
          courseId: String(courseId),
          clerkUserId: userId,
          studentName: resolvedStudentName,
        },
      });
    } catch (stripeErr) {
      console.error("Stripe create session error:", stripeErr);

      return res.status(502).json({
        success: false,
        message:
          stripeErr?.raw?.message ||
          stripeErr?.message ||
          "Stripe payment error",
      });
    }

    try {
      const booking = await Booking.create({
        ...basePayload,
        sessionId: session.id,
        paymentIntentId: session.payment_intent || null,
      });

      return res.status(201).json({
        success: true,
        booking,
        checkoutUrl: session.url || null,
      });
    } catch (dbErr) {
      console.error("DB error saving booking:", dbErr);

      try {
        await stripe.checkout.sessions.expire(session.id);
      } catch (expireErr) {
        console.error("Failed to expire Stripe session:", expireErr);
      }

      return res.status(500).json({
        success: false,
        message: "Failed to create booking record",
      });
    }
  } catch (err) {
    console.error("createBooking error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Confirm payment
export const confirmPayment = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { session_id } = req.query;

    if (!session_id || typeof session_id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid session_id is required",
      });
    }

    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: "Stripe not configured",
      });
    }

    const booking = await Booking.findOne({
      sessionId: session_id,
      clerkUserId: userId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid" || session.status !== "complete") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    // Verify Stripe payment details
    if (
      session.metadata?.bookingId !== booking.bookingId ||
      session.metadata?.clerkUserId !== userId ||
      session.metadata?.courseId !== String(booking.course) ||
      session.currency !== "inr" ||
      session.amount_total !== Math.round(booking.price * 100)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment session verification failed",
      });
    }

    const updatedBooking = await Booking.findOneAndUpdate(
      {
        _id: booking._id,
        clerkUserId: userId,
        paymentStatus: { $ne: "Paid" },
      },
      {
        $set: {
          paymentStatus: "Paid",
          paymentIntentId: session.payment_intent || null,
          orderStatus: "Confirmed",
          paidAt: new Date(),
        },
      },
      { new: true },
    );

    const confirmedBooking =
      updatedBooking || (await Booking.findById(booking._id));

    return res.status(200).json({
      success: true,
      booking: confirmedBooking,
    });
  } catch (err) {
    console.error("confirmPayment error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get logged-in user's bookings
export const getUserBooking = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const bookings = await Booking.find({
      clerkUserId: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.error("getUserBookings error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get booking statistics
export const getStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const totalRevenueAgg = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
        },
      },
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const bookingsLast7Days = await Booking.countDocuments({
      createdAt: {
        $gte: sevenDaysAgo,
      },
    });

    const topCourses = await Booking.aggregate([
      {
        $group: {
          _id: "$courseName",
          count: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$paymentStatus", "Paid"] }, "$price", 0],
            },
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 6,
      },
      {
        $project: {
          courseName: "$_id",
          count: 1,
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue,
        bookingsLast7Days,
        topCourses,
      },
    });
  } catch (err) {
    console.error("getStats error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
