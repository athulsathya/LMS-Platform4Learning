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

  const fmtCurrency = (n) => {
    if (n == null) return "₹0";

    const num = Number(n);

    if (Number.isNaN(num)) return "₹0";

    return `₹${num}`;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [statsData, setStatsData] = useState(null);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const iconMap = {
    Users,
    ShoppingCart,
    BookMarked,
    BadgeIndianRupee,
  };

  const buildStats = (backendStats) => {
    const totalBookings = backendStats?.totalBookings ?? 0;
    const totalRevenue = backendStats?.totalRevenue ?? 0;
    const bookingsLast7Days = backendStats?.bookingsLast7Days ?? 0;
    const topCourses = backendStats?.topCourses ?? [];

    return [
      {
        title: "Total Bookings",
        value: totalBookings,
        icon: iconMap.Users,
        color: "indigo",
      },
      {
        title: "Revenue",
        value: fmtCurrency(totalRevenue),
        icon: iconMap.BadgeIndianRupee,
        color: "green",
      },
      {
        title: "Bookings (7d)",
        value: bookingsLast7Days,
        icon: iconMap.ShoppingCart,
        color: "yellow",
      },
      {
        title: "Top Courses",
        value: topCourses.length || 0,
        icon: iconMap.BookMarked,
        color: "purple",
      },
    ];
  };

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError(null);

    const fetchStats = () =>
      fetch(`${API_BASE}/api/booking/stats`)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch stats");
          return r.json();
        })
        .then((j) =>
          j.success ? j.stats : Promise.reject(j.message || "Stats error"),
        );

    const fetchCourses = () =>
      fetch(`${API_BASE}/api/course`)
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch courses");
          return r.json();
        })
        .then((j) =>
          j.success ? j.courses : Promise.reject(j.message || "Course error"),
        );

    Promise.all([fetchStats(), fetchCourses()])
      .then(([stats, courses]) => {
        if (!mounted) return;

        const topLookup = {};

        Array.isArray(stats?.topCourses) &&
          stats.topCourses.forEach((t) => {
            if (!t) return;

            const name = t.courseName || "";

            topLookup[name] = {
              purchases: Number(t.count || 0),
              revenue: Number(t.revenue || 0),
            };
          });

        const mapped = (courses || []).map((c) => {
          const id = c._id ?? c.id ?? c.courseId ?? "";
          const name = c.name ?? c.title ?? "Untitled Course";

          const image = c.image || c.thumbnail || c.courseImage || "";

          const instructor = c.teacher ?? c.instructor ?? "Unknown";

          const metrics = topLookup[name] || {
            purchases: 0,
            revenue: 0,
          };

          const students = metrics.purchases || c.students || 0;

          const purchases = metrics.purchases || c.purchases || 0;

          const earnings = metrics.revenue || c.earnings || 0;

          let priceDisplay = "Free";

          if (c.price && (c.price.sale != null || c.price.original != null)) {
            const sale = c.price.sale != null ? Number(c.price.sale) : null;

            const orig =
              c.price.original != null ? Number(c.price.original) : null;

            priceDisplay =
              sale != null
                ? fmtCurrency(sale)
                : orig != null
                  ? fmtCurrency(orig)
                  : "Free";
          } else if (c.pricingType && c.pricingType !== "free") {
            priceDisplay = "₹0";
          }

          return {
            id,
            image,
            name,
            instructor,
            students,
            price: priceDisplay,
            purchases,
            earnings: fmtCurrency(earnings),
          };
        });

        setStatsData(buildStats(stats));
        setCoursesData(mapped);
      })
      .catch((err) => {
        console.error("Dashboard fetch error:", err);

        if (mounted) {
          setError(String(err) || "Failed to load dashboard data");
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const stats = statsData || [
    {
      title: "Total Bookings",
      value: 0,
      icon: iconMap.Users,
      color: "indigo",
    },
    {
      title: "Revenue",
      value: "₹0",
      icon: iconMap.BadgeIndianRupee,
      color: "green",
    },
    {
      title: "Bookings (7d)",
      value: 0,
      icon: iconMap.ShoppingCart,
      color: "yellow",
    },
    {
      title: "Top Courses",
      value: 0,
      icon: iconMap.BookMarked,
      color: "purple",
    },
  ];

  const filteredCourses = coursesData.filter(
    (course) =>
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.instructor || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  return (
    <div className={dashboardStyles.pageContainer}>
      <div className={dashboardStyles.backgroundPattern}></div>

      <div className={dashboardStyles.contentContainer}>
        {/* Header */}

        <div className={dashboardStyles.headerContainer}>
          <h1 className={dashboardStyles.headerTitle}>Dashboard Overview</h1>

          <p className={dashboardStyles.headerSubtitle}>
            Welcome Back! Here's whats Happening with your courses today.
          </p>
        </div>

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
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={dashboardStyles.statTitle}>{stat.title}</p>

                    <p className={dashboardStyles.statValue}>{stat.value}</p>
                  </div>

                  <div className={dashboardStyles.statIconContainer}>
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

          {/* Table */}

          <div className={dashboardStyles.tableContainer}>
            <table className={dashboardStyles.table}>
              <thead className={dashboardStyles.tableHead}>
                <tr>
                  <th className={dashboardStyles.tableHeader}>Course</th>

                  <th className={dashboardStyles.tableHeader}>Students</th>

                  <th className={dashboardStyles.tableHeader}>Price</th>

                  <th className={dashboardStyles.tableHeader}>Purchases</th>

                  <th className={dashboardStyles.tableHeader}>Earnings</th>
                </tr>
              </thead>

              <tbody className={dashboardStyles.tableBody}>
                {filteredCourses.map((course, index) => (
                  <tr
                    key={course.id || index}
                    className={dashboardStyles.tableRow}
                    style={{
                      animationDelay: `${index * 50 + 400}ms`,
                    }}
                  >
                    <td className="px-4 sm:px-6 sm:py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={course.image}
                          alt={course.name}
                          className={dashboardStyles.courseImage}
                        />

                        <div>
                          <p className="font-semibold">{course.name}</p>

                          <p className="text-sm text-gray-500">
                            {course.instructor}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 sm:px-6 sm:py-4">{course.students}</td>

                    <td className="px-4 sm:px-6 sm:py-4">{course.price}</td>

                    <td className="px-4 sm:px-6 sm:py-4">{course.purchases}</td>

                    <td className="px-4 sm:px-6 sm:py-4">{course.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCourses.length === 0 && !loading && (
              <div className={dashboardStyles.emptyState}>
                <Search className={dashboardStyles.emptyIcon} />
                <p className={dashboardStyles.emptyText}>
                  No Courses found matching your search
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className={dashboardStyles.clearButton}
                >
                  Clear search
                </button>
              </div>
            )}
            {loading && (
              <div className={dashboardStyles.loadingOverlay}>
                <div className={dashboardStyles.loadingSpinner}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
