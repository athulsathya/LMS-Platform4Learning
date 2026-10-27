import React, { useEffect, useState } from "react";
import { homeCoursesStyles } from "../assets/dummyStyles";
import { coursesData } from "../assets/dummyHdata";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, User } from "lucide-react";
import { toast, Slide, ToastContainer } from "react-toastify";

function HomeCourse() {
  const navigate = useNavigate();

  const { title, course: courseFont, detail } = homeCoursesStyles.fonts;

  const visibleCourses = coursesData.slice(0, 8);

  const [userRatings, setUserRatings] = useState(() => {
    try {
      const raw = localStorage.getItem("userCourseRatings");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [hoverRatings, setHoverRatings] = useState({});

  useEffect(() => {
    try {
      localStorage.setItem("userCourseRatings", JSON.stringify(userRatings));
    } catch (error) {
      console.error("Error saving ratings:", error);
    }
  }, [userRatings]);

  // Login toast
  const showLoginToast = () => {
    toast.error("Please login to access this course", {
      position: "top-right",
      transition: Slide,
      autoClose: 3000,
      theme: "dark",
    });
  };

  // Handle course click
  const handleCourseClick = (id) => {
    const token = localStorage.getItem("token");

    console.log("Token after logout:", token);

    if (!token || token === "undefined" || token === "null") {
      console.log("User not logged in - showing toast");
      showLoginToast();
      return;
    }

    navigate(`/course/${id}`);
  };

  // Browse all courses
  const handleBrowseClick = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to access courses", {
        position: "top-right",
        transition: Slide,
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    navigate("/courses");
  };

  // Set course rating
  const handleSetRating = (e, courseId, rating) => {
    e.stopPropagation();

    setUserRatings((prev) => ({
      ...prev,
      [courseId]: rating,
    }));
  };

  // Interactive rating stars
  const renderInteractiveStars = (course) => {
    const userRating = userRatings[course.id] || 0;
    const hover = hoverRatings[course.id] || 0;
    const displayRating = hover || userRating;

    return (
      <div className={homeCoursesStyles.starsContainer}>
        <div
          className={homeCoursesStyles.interactiveStars}
          onClick={(e) => e.stopPropagation()}
        >
          {Array.from({ length: 5 }).map((_, i) => {
            const idx = i + 1;
            const filled = idx <= displayRating;

            return (
              <button
                key={i}
                type="button"
                aria-label={`Rate ${idx} stars`}
                onClick={(e) => handleSetRating(e, course.id, idx)}
                onMouseEnter={() =>
                  setHoverRatings((prev) => ({
                    ...prev,
                    [course.id]: idx,
                  }))
                }
                onMouseLeave={() =>
                  setHoverRatings((prev) => ({
                    ...prev,
                    [course.id]: 0,
                  }))
                }
                className={`${homeCoursesStyles.starButton} ${
                  filled
                    ? homeCoursesStyles.starButtonActive
                    : homeCoursesStyles.starButtonInactive
                }`}
                style={{ background: "transparent" }}
              >
                <Star
                  size={16}
                  fill={filled ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={homeCoursesStyles.starIcon}
                />
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={homeCoursesStyles.container}>
      <div className={homeCoursesStyles.mainContainer}>
        {/* Header */}
        <div className={homeCoursesStyles.header}>
          <h2 className={`${title} ${homeCoursesStyles.title}`}>
            <Star className={homeCoursesStyles.titleIcon} />
            Explore Top Courses
            <Star className={homeCoursesStyles.titleIcon} />
          </h2>
        </div>

        {/* Courses Grid */}
        <div className={homeCoursesStyles.coursesGrid}>
          {visibleCourses.map((course) => {
            const isFree = course.isFree === true || course.price == null;

            return (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course.id)}
                className={
                  homeCoursesStyles.courseCard ||
                  "rounded-xl overflow-hidden shadow-md cursor-pointer bg-white"
                }
              >
                {/* Course Image */}
                <div className={homeCoursesStyles.imageContainer}>
                  <img
                    src={course.image}
                    alt={course.name}
                    className={homeCoursesStyles.courseImage}
                    loading="lazy"
                  />
                </div>

                {/* Course Information */}
                <div className={homeCoursesStyles.courseInfo}>
                  {/* Course Name */}
                  <h3
                    className={`${courseFont} ${homeCoursesStyles.courseName}`}
                  >
                    {course.name}
                  </h3>

                  {/* Teacher Information */}
                  <div className={`${detail} ${homeCoursesStyles.teacherInfo}`}>
                    <User size={15} className={homeCoursesStyles.teacherIcon} />

                    <span className={homeCoursesStyles.teacherName}>
                      {course.teacher}
                    </span>
                  </div>

                  {/* Interactive Ratings */}
                  {renderInteractiveStars(course)}

                  {/* Course Price */}
                  <div className="mt-3 flex items-center gap-2">
                    {isFree ? (
                      <span className="text-sm font-semibold text-green-600">
                        Free
                      </span>
                    ) : (
                      <>
                        <span className={homeCoursesStyles.salePrice}>
                          ₹{course.price?.sale ?? "-"}
                        </span>

                        {course.price.original && (
                          <span className={homeCoursesStyles.originalPrice}>
                            ₹{course.price.originalPrice}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA BTN */}
        <div className={homeCoursesStyles.ctaContainer}>
          <div className={homeCoursesStyles.ctaWrapper}>
            <span
              className={homeCoursesStyles.ctaGlow}
              style={{
                zIndex: 0,
                background:
                  "conic-gradient(from 0deg, rgba(236,72,153,0.9), rgba(99,102,241,0.9), rgba(139,92,246,0.9), rgba(236,72,153,0.9))",
                filter: "blur(5px)",
                opacity: 0.8,
              }}
            ></span>

            <button
              onClick={handleBrowseClick}
              className={homeCoursesStyles.ctaButton}
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              }}
            >
              <span className={homeCoursesStyles.ctaButtonContent}>
                <span className={homeCoursesStyles.ctaText}>
                  Discover Courses
                </span>
                <ArrowRight className={homeCoursesStyles.ctaIcon} />
              </span>
            </button>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        transition={Slide}
      />
    </div>
  );
}

export default HomeCourse;
