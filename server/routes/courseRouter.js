import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  getMyRating,
  getPublicCourses,
  rateCourse,
} from "../controllers/courseController.js";

// Create uploads folder
const uploadDir = process.env.VERCEL
  ? "/tmp/uploads"
  : path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const unique =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const ext = path.extname(file.originalname).trim();

    cb(null, `course-${unique}${ext}`);
  },
});

const upload = multer({ storage });

const courseRouter = express.Router();

courseRouter.get("/public", getPublicCourses);
courseRouter.get("/", getCourses);
courseRouter.get("/:id", getCourseById);

courseRouter.post("/", upload.single("image"), createCourse);

courseRouter.delete("/:id", deleteCourse);

courseRouter.post("/:courseId/rate", rateCourse);
courseRouter.get("/:courseId/rating", getMyRating);

export default courseRouter;