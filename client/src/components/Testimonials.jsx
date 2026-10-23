import React, { useEffect, useRef } from "react";
import { testimonialStyles } from "../assets/dummyStyles";
import testimonials from "../assets/dummyTestimonial";
import { MessageSquareQuote } from "lucide-react";

function Testimonials() {
  const cardsRef = useRef([]);
  const resetTimersRef = useRef(new Map());

  // Only apply tilt on desktop pointer devices
  const isPointerDevice = () =>
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(pointer: fine)").matches;

  // Enhanced 3D tilt with parallax layers
  const onMouseMove = (e, el) => {
    if (!el || !isPointerDevice()) return;

    // Clear any pending reset animation
    const resetTimer = resetTimersRef.current.get(el);

    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimersRef.current.delete(el);
    }

    el.style.transition = "";

    const rect = el.getBoundingClientRect();

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const px = (x - 0.5) * 2;
    const py = (y - 0.5) * 2;

    const rotateMax = 10;
    const translateMax = 8;

    const rx = -py * rotateMax;
    const ry = px * rotateMax;
    const tx = px * translateMax;
    const ty = py * translateMax;

    // Main card transform
    el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${tx}px, ${ty}px, 0)`;

    // Parallax effects for inner elements
    const avatar = el.querySelector(".avatar-container");
    const quote = el.querySelector(".quote-icon");
    const badge = el.querySelector(".course-badge");

    [avatar, quote, badge].forEach((element) => {
      if (element) element.style.transition = "";
    });

    if (avatar) {
      avatar.style.transform = `translate3d(${tx * 0.3}px, ${
        ty * 0.3
      }px, 20px)`;
    }

    if (quote && window.innerWidth >= 640) {
      quote.style.transform = `translate3d(${tx * 0.5}px, ${
        ty * 0.5
      }px, 40px) rotate(${ry * 2}deg)`;
    }

    if (badge) {
      badge.style.transform = `translate3d(${tx * 0.2}px, ${ty * 0.2}px, 30px)`;
    }
  };

  const onMouseLeave = (el) => {
    if (!el || !isPointerDevice()) return;

    const existingTimer = resetTimersRef.current.get(el);

    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    el.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg) translate3d(0,0,0)";

    el.style.transition = "transform 600ms cubic-bezier(.23,1,.32,1)";

    // Reset parallax elements
    const avatar = el.querySelector(".avatar-container");
    const quote = el.querySelector(".quote-icon");
    const badge = el.querySelector(".course-badge");

    [avatar, quote, badge].forEach((element) => {
      if (element) {
        element.style.transform = "translate3d(0,0,0)";
        element.style.transition = "transform 600ms cubic-bezier(.23,1,.32,1)";
      }
    });

    const timer = setTimeout(() => {
      el.style.transition = "";

      [avatar, quote, badge].forEach((element) => {
        if (element) element.style.transition = "";
      });

      resetTimersRef.current.delete(el);
    }, 650);

    resetTimersRef.current.set(el, timer);
  };

  useEffect(() => {
    const timers = [];
    const resetTimers = resetTimersRef.current;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const index = cardsRef.current.indexOf(en.target);

            const timer = setTimeout(
              () => {
                en.target.classList.add("card-visible");
              },
              Math.max(index, 0) * 150,
            );

            timers.push(timer);
            obs.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    cardsRef.current.forEach((card) => {
      if (card) obs.observe(card);
    });

    return () => {
      obs.disconnect();

      timers.forEach((timer) => clearTimeout(timer));

      resetTimers.forEach((timer) => clearTimeout(timer));
      resetTimers.clear();
    };
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`${testimonialStyles.star} ${
          i < Math.floor(rating)
            ? testimonialStyles.starActive
            : testimonialStyles.starInactive
        }`}
        viewBox="0 0 24 24"
      >
        <path d="M12 .587l3.668 7.431L24 9.748l-6 5.847L19.335 24 12 19.897 4.665 24 6 15.595 0 9.748l8.332-1.73z" />
      </svg>
    ));
  };

  return (
    <section className={testimonialStyles.section}>
      <div className={testimonialStyles.container}>
        <div className={testimonialStyles.badge}>
          <div className={testimonialStyles.badgeDot}></div>

          <span className={testimonialStyles.badgeText}>
            Student Testimonials
          </span>
        </div>

        <h2 className={testimonialStyles.title}>
          <span className={testimonialStyles.titleGradient}>
            Voices of Success
          </span>
        </h2>

        <p className={testimonialStyles.subtitle}>
          Discover how our learners transformed their career with hands-on
          projects and expert mentorship
        </p>

        <div className={testimonialStyles.grid}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              onMouseMove={(e) => onMouseMove(e, cardsRef.current[i])}
              onMouseLeave={() => onMouseLeave(cardsRef.current[i])}
              className={testimonialStyles.cardWrapper}
            >
              <div className={testimonialStyles.glowBorder}></div>

              <div className={testimonialStyles.backgroundPattern}></div>

              <div className={testimonialStyles.floatingElement1}></div>

              <div className={testimonialStyles.floatingElement2}></div>

              <article
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className={testimonialStyles.card}
                style={{
                  boxShadow: testimonialStyles.cardShadow,
                }}
              >
                {/* Course Badge */}
                <div
                  className={`${testimonialStyles.courseBadge} course-badge`}
                >
                  <div className={testimonialStyles.courseBadgeDot}></div>

                  <span className={testimonialStyles.courseBadgeText}>
                    {t.course}
                  </span>
                </div>

                {/* Quote Icon */}
                <div className={`${testimonialStyles.quoteIcon} quote-icon`}>
                  <MessageSquareQuote
                    className={testimonialStyles.quoteIconSvg}
                  />
                </div>

                {/* Card Content */}
                <div className={testimonialStyles.content}>
                  <div
                    className={`${testimonialStyles.avatarContainer} avatar-container`}
                  >
                    <div className={testimonialStyles.avatarWrapper}>
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className={testimonialStyles.avatarImage}
                        loading="lazy"
                      />
                    </div>

                    <div className={testimonialStyles.avatarGlow}></div>

                    <div className={testimonialStyles.userInfo}>
                      <div className={testimonialStyles.userHeader}>
                        <div className="min-w-0">
                          <h3 className={testimonialStyles.userName}>
                            {t.name}
                          </h3>

                          <p className={testimonialStyles.userRole}>{t.role}</p>
                        </div>

                        <div className={testimonialStyles.ratingContainer}>
                          <div className={testimonialStyles.starsContainer}>
                            {renderStars(t.rating)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
