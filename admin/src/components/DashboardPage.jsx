
import React, { useEffect, useState } from "react";

import { dashboardStyles } from "../assets/dummyStylesAd";

import {
  BadgeIndianRupee,
  BookMarked,
  BookOpenText,
  Search,
  ShoppingCart,
  Users,
} from "lucide-react";

function DashboardPage() {
  const API_BASE = "http://localhost:4000";

  const [searchTerm, setSearchTerm] = useState("");
  const [statsData, setStatsData] = useState(null);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fmtCurrency = (n) => {
    const num = Number(n);
    return Number.isFinite(num) ? `₹${num}` : "₹0";
  };

  const buildStats = (backendStats = {}) => {
    return [
      {
        title: "Total Bookings",
        value: backendStats.totalBookings ?? 0,
        icon: Users,
      },
      {
        title: "Revenue",
        value: fmtCurrency(backendStats.totalRevenue),
        icon: BadgeIndianRupee,
      },
      {
        title: "Bookings (7d)",
        value: backendStats.bookingsLast7Days ?? 0,
        icon: ShoppingCart,
      },
      {
        title: "Top Courses",
        value: Array.isArray(backendStats.topCourses)
          ? backendStats.topCourses.length
          : 0,
        icon: BookMarked,
      },
    ];
  };

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch courses
        const coursesResponse = await fetch(`${API_BASE}/api/course`);

        if (!coursesResponse.ok) {
          throw new Error(
            `Course API failed: ${coursesResponse.status}`
          );
        }

        const coursesResult = await coursesResponse.json();

        console.log("Courses API response:", coursesResult);

        // Support different backend response structures
        const courses = Array.isArray(coursesResult)
          ? coursesResult
          : coursesResult.courses ||
            coursesResult.data ||
            coursesResult.allCourses ||
            [];

        if (!Array.isArray(courses)) {
          throw new Error("Invalid courses response from backend");
        }

        // Fetch statistics separately
        let stats = {};

        try {
          const statsResponse = await fetch(
            `${API_BASE}/api/booking/stats`
          );

          if (statsResponse.ok) {
            const statsResult = await statsResponse.json();

            stats =
              statsResult.stats ||
              statsResult.data ||
              statsResult ||
              {};
          }
        } catch (statsError) {
          console.error("Stats API error:", statsError);
        }

        if (!mounted) return;

        // Prepare top course statistics
        const topLookup = {};

        const topCourses = Array.isArray(stats.topCourses)
          ? stats.topCourses
          : [];

        topCourses.forEach((item) => {
          if (!item) return;

          const name = item.courseName || item.name || "";

          topLookup[name] = {
            purchases: Number(item.count || 0),
            revenue: Number(item.revenue || 0),
          };
        });

        // Map course data
        const mappedCourses = courses.map((course, index) => {
          const id =
            course._id ||
            course.id ||
            course.courseId ||
            `course-${index}`;

          const name =
            course.name ||
            course.title ||
            course.courseName ||
            "Untitled Course";

          const image =
            course.image ||
            course.thumbnail ||
            course.courseImage ||
            course.imageUrl ||
            "";

          const instructor =
            course.teacher?.name ||
            course.teacher ||
            course.instructor?.name ||
            course.instructor ||
            course.createdBy?.name ||
            "Unknown";

          const metrics = topLookup[name] || {};

          const students =
            metrics.purchases ??
            course.students ??
            course.totalStudents ??
            0;

          const purchases =
            metrics.purchases ??
            course.purchases ??
            course.totalPurchases ??
            0;

          const earnings =
            metrics.revenue ??
            course.earnings ??
            course.revenue ??
            0;

          let price = "Free";

          if (
            typeof course.price === "object" &&
            course.price !== null
          ) {
            const sale = course.price.sale;
            const original = course.price.original;

            if (sale != null) {
              price = fmtCurrency(sale);
            } else if (original != null) {
              price = fmtCurrency(original);
            }
          } else if (course.price != null) {
            price =
              Number(course.price) === 0
                ? "Free"
                : fmtCurrency(course.price);
          }

          return {
            id,
            name,
            image,
            instructor,
            students,
            price,
            purchases,
            earnings: fmtCurrency(earnings),
          };
        });

        setCoursesData(mappedCourses);
        setStatsData(buildStats(stats));
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        if (mounted) {
          setError(err.message || "Failed to load dashboard data");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  const stats = statsData || buildStats();

  // Fix for statIconContainer:
  // Supports both function and string definitions in your style file.
  const statIconContainerClass =
    typeof dashboardStyles.statIconContainer === "function"
      ? dashboardStyles.statIconContainer("bg-indigo-500")
      : dashboardStyles.statIconContainer ||
        "p-3 rounded-full text-white bg-indigo-500";

  // Search filtering
  const filteredCourses = coursesData.filter((course) => {
    const search = searchTerm.toLowerCase();

    return (
      course.name.toLowerCase().includes(search) ||
      String(course.instructor).toLowerCase().includes(search)
    );
  });

  return (
    <div className={dashboardStyles.pageContainer}>
      <div className={dashboardStyles.backgroundPattern}></div>

      <div className={dashboardStyles.contentContainer}>
        {/* Header */}
        <div className={dashboardStyles.headerContainer}>
          <h1 className={dashboardStyles.headerTitle}>
            Dashboard Overview
          </h1>

          <p className={dashboardStyles.headerSubtitle}>
            Welcome Back! Here's what's happening with your courses today.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className={dashboardStyles.errorBanner} role="alert">
            {error}
          </div>
        )}

        {/* Stats Section */}
        <div className={dashboardStyles.statsGrid}>
          {stats.map((stat, index) => {
            const Icon = stat.icon || Users;

            return (
              <div
                key={stat.title}
                className={dashboardStyles.statCard}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={dashboardStyles.statTitle}>
                      {stat.title}
                    </p>

                    <p className={dashboardStyles.statValue}>
                      {stat.value}
                    </p>
                  </div>

                  <div className={statIconContainerClass}>
                    <Icon className={dashboardStyles.statIcon} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Courses Section */}
        <div className={dashboardStyles.coursesContainer}>
          <div className={dashboardStyles.coursesHeader}>
            <div className={dashboardStyles.coursesTitleContainer}>
              <BookOpenText className={dashboardStyles.coursesIcon} />

              <h2 className={dashboardStyles.coursesTitle}>
                Course Performance
              </h2>
            </div>

            <div className={dashboardStyles.searchContainer}>
              <Search className={dashboardStyles.searchIcon} />

              <input
                type="text"
                placeholder="Search Courses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={dashboardStyles.searchInput}
              />
            </div>
          </div>

          {/* Courses Table */}
          <div className={dashboardStyles.tableContainer}>
            <table className={dashboardStyles.table}>
              <thead className={dashboardStyles.tableHead}>
                <tr>
                  <th className={dashboardStyles.tableHeader}>
                    Course
                  </th>

                  <th className={dashboardStyles.tableHeader}>
                    Students
                  </th>

                  <th className={dashboardStyles.tableHeader}>
                    Price
                  </th>

                  <th className={dashboardStyles.tableHeader}>
                    Purchases
                  </th>

                  <th className={dashboardStyles.tableHeader}>
                    Earnings
                  </th>
                </tr>
              </thead>

              <tbody className={dashboardStyles.tableBody}>
                {filteredCourses.map((course, index) => (
                  <tr
                    key={course.id}
                    className={dashboardStyles.tableRow}
                    style={{
                      animationDelay: `${index * 50 + 400}ms`,
                    }}
                  >
                    <td className="px-4 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-3">
                        {course.image ? (
                          <img
                            src={course.image}
                            alt={course.name}
                            className={dashboardStyles.courseImage}
                          />
                        ) : (
                          <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <BookOpenText className="text-gray-500" />
                          </div>
                        )}

                        <div>
                          <p className="font-semibold">
                            {course.name}
                          </p>

                          <p className="text-sm text-gray-500">
                            {course.instructor}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 sm:py-4">
                      {course.students}
                    </td>

                    <td className="px-4 sm:px-6 sm:py-4">
                      {course.price}
                    </td>

                    <td className="px-4 sm:px-6 sm:py-4">
                      {course.purchases}
                    </td>

                    <td className="px-4 sm:px-6 sm:py-4">
                      {course.earnings}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Loading */}
            {loading && (
              <div className={dashboardStyles.loadingOverlay}>
                <div className={dashboardStyles.loadingSpinner}></div>
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredCourses.length === 0 && (
              <div className={dashboardStyles.emptyState}>
                <Search className={dashboardStyles.emptyIcon} />

                <p className={dashboardStyles.emptyText}>
                  {coursesData.length === 0
                    ? "No courses available"
                    : "No courses found matching your search"}
                </p>

                <button
                  onClick={() => setSearchTerm("")}
                  className={dashboardStyles.clearButton}
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
