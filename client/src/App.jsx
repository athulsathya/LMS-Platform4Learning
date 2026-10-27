
import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faculty from "./pages/Faculty";
import Courses from "./pages/Courses";
import CourseDetailPageHome from "./pages/CourseDetailPageHome";
import CourseDetailPage from "./pages/CourseDetailPage";
import { ArrowUp } from "lucide-react";

// To protect the route
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return Boolean(token);
  };

  if (!isAuthenticated()) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// Scroll to top when route changes
const ScrollToTopOnRouteChange = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  return null;
};

// Scroll to top button
const ScrollTopButton = ({ threshold = 200, showOnMount = false }) => {
  const [visible, setVisible] = useState(!!showOnMount);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={
        "fixed right-6 bottom-6 z-50 p-3 rounded-full " +
        "bg-sky-500 text-white shadow-lg " +
        "hover:bg-sky-600 transition-all duration-300 " +
        "focus:outline-none focus:ring-2 focus:ring-sky-300 " +
        "backdrop-blur border border-sky-400 cursor-pointer"
      }
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};

const App = () => {
  return (
    <>
      <ScrollToTopOnRouteChange />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/faculty" element={<Faculty />} />

        <Route path="/courses" element={<Courses />} />

        {/* Navbar Courses -> CourseDetailPage */}
        <Route
          path="/course/:id"
          element={
            <ProtectedRoute>
              <CourseDetailPageHome />
            </ProtectedRoute>
          }
        />

        {/* HomeCourses -> CourseDetailPageHome */}
        <Route
          path="/courses/:id"
          element={
            <ProtectedRoute>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <ScrollTopButton threshold={250} />
    </>
  );
};

export default App;
