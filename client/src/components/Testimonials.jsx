
import React, { useEffect, useRef } from "react";
import { testimonialStyles } from "../assets/dummyStyles";
import testimonials from "../assets/dummyTestimonial";
import {
  BadgeCheck,
  CalendarDays,
  MessageSquareQuote,
  Star,
} from "lucide-react";

function Testimonials() {
  const cardsRef = useRef([]);
  const resetTimersRef = useRef(new Map());

  // Only apply tilt on desktop pointer devices
  const isPointerDevice = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches;

  // Enhanced 3D tilt with parallax layers
  const onMouseMove = (e, el) => {
    if (!el || !isPointerDevice()) return;

    const resetTimer = resetTimersRef.current.get(el);

    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimersRef.current.delete(el);
    }

    el.style.transition = "";

    const rect = el.getBoundingClientRect();

    if (!rect.width || !rect.height) return;

    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const px = (x - 0.5) * 2;
    const py = (y - 0.5) * 2;

    const rotateMax = 8;
    const translateMax = 5;

    const rx = -py * rotateMax;
    const ry = px * rotateMax;
    const tx = px * translateMax;
    const ty = py * translateMax;

    el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(${tx}px, ${ty}px, 0)`;

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
      badge.style.transform = `translate3d(${tx * 0.2}px, ${
        ty * 0.2
      }px, 30px)`;
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

    el.style.transition =
      "transform 600ms cubic-bezier(.23,1,.32,1)";

    const avatar = el.querySelector(".avatar-container");
    const quote = el.querySelector(".quote-icon");
    const badge = el.querySelector(".course-badge");

    [avatar, quote, badge].forEach((element) => {
      if (element) {
        element.style.transform = "translate3d(0,0,0)";
        element.style.transition =
          "transform 600ms cubic-bezier(.23,1,.32,1)";
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

  // Scroll reveal animation
  useEffect(() => {
    const timers = [];
    const resetTimers = resetTimersRef.current;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardsRef.current.indexOf(entry.target);

            const timer = setTimeout(() => {
              entry.target.classList.add("card-visible");
            }, Math.max(index, 0) * 150);

            timers.push(timer);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    cardsRef.current.forEach((card) => {
      if (card) obs.observe(card);
    });

    return () => {
      obs.disconnect();
      timers.forEach(clearTimeout);

      resetTimers.forEach(clearTimeout);
      resetTimers.clear();
    };
  }, []);

  // Rating stars
  const renderStars = (rating) => {
    const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="relative inline-flex">
        <Star
          size={15}
          className="fill-gray-200 text-gray-200"
        />

        <span
          className="absolute inset-0 overflow-hidden"
          style={{
            width: `${Math.max(
              0,
              Math.min(1, safeRating - i)
            ) * 100}%`,
          }}
        >
          <Star
            size={15}
            className="fill-amber-400 text-amber-400"
          />
        </span>
      </span>
    ));
  };

  return (
    <section className={testimonialStyles.section}>
      <div className={testimonialStyles.container}>

        {/* Section Badge */}
        <div className={testimonialStyles.badge}>
          <div className={testimonialStyles.badgeDot}></div>
          <span className={testimonialStyles.badgeText}>
            Student Testimonials
          </span>
        </div>

        {/* Section Heading */}
        <h2 className={testimonialStyles.title}>
          <span className={testimonialStyles.titleGradient}>
            Voices of Success
          </span>
        </h2>

        <p className={testimonialStyles.subtitle}>
          Discover how our learners transformed their careers
          with hands-on projects and expert mentorship.
        </p>

        {/* Testimonials Grid */}
        <div className={testimonialStyles.grid}>
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className={`${testimonialStyles.cardWrapper} h-full`}
              onMouseMove={(e) =>
                onMouseMove(e, cardsRef.current[i])
              }
              onMouseLeave={() =>
                onMouseLeave(cardsRef.current[i])
              }
            >
              {/* Decorative Elements */}
              <div className={testimonialStyles.glowBorder}></div>
              <div className={testimonialStyles.backgroundPattern}></div>
              <div className={testimonialStyles.floatingElement1}></div>
              <div className={testimonialStyles.floatingElement2}></div>

              {/* Testimonial Card */}
              <article
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className={`${testimonialStyles.card} relative flex h-full flex-col`}
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
                <div
                  className={`${testimonialStyles.quoteIcon} quote-icon`}
                >
                  <MessageSquareQuote
                    className={testimonialStyles.quoteIconSvg}
                  />
                </div>

                {/* Card Content */}
                <div
                  className={`${testimonialStyles.content} flex flex-1 flex-col`}
                >
                  {/* Student Profile */}
                  <div
                    className={`${testimonialStyles.avatarContainer} avatar-container flex items-center gap-3 sm:gap-4`}
                  >
                    {/* Avatar */}
                    <div
                      className={`${testimonialStyles.avatarWrapper} relative shrink-0`}
                    >
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className={`${testimonialStyles.avatarImage} object-cover`}
                        loading="lazy"
                      />
                      <div
                        className={testimonialStyles.avatarGlow}
                      ></div>
                    </div>

                    {/* Student Details */}
                    <div
                      className={`${testimonialStyles.userInfo} min-w-0 flex-1`}
                    >
                      <div
                        className={`${testimonialStyles.userHeader} flex flex-col items-start gap-1`}
                      >
                        <div className="min-w-0">
                          <h3
                            className={testimonialStyles.userName}
                          >
                            {t.name}
                          </h3>

                          <p
                            className={testimonialStyles.userRole}
                          >
                            {t.role}
                          </p>
                        </div>

                        {/* Rating */}
                        <div
                          className={`${testimonialStyles.ratingContainer} flex items-center gap-2`}
                        >
                          <div
                            className={`${testimonialStyles.starsContainer} flex items-center gap-0.5`}
                          >
                            {renderStars(t.rating)}
                          </div>

                          <span className="text-xs font-semibold text-amber-500">
                            {Number(t.rating).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial Message */}
                  <div className="mt-5 flex-1">
                    <blockquote
                      className={`${testimonialStyles.message} leading-relaxed`}
                    >
                      <span
                        className={testimonialStyles.quoteMark}
                      >
                        &ldquo;
                      </span>
                      {t.message}
                      <span
                        className={testimonialStyles.quoteMark}
                      >
                        &rdquo;
                      </span>
                    </blockquote>
                  </div>

                  {/* Card Footer */}
                  <div
                    className={`${testimonialStyles.footer} mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200/20 pt-4`}
                  >
                    {/* Verified Student */}
                    <div
                      className={`${testimonialStyles.verified} flex items-center gap-1.5`}
                    >
                      <BadgeCheck
                        className={testimonialStyles.verifiedIcon}
                      />
                      <span>Verified student</span>
                    </div>

                    {/* Date */}
                    <div
                      className={`${testimonialStyles.date} flex items-center gap-1.5`}
                    >
                      <CalendarDays
                        className={testimonialStyles.dateIcon}
                      />
                      <span>2025</span>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>

        {/* Custom Animations */}
        <style>{testimonialStyles.animations}</style>
      </div>
    </section>
  );
}

export default Testimonials;
