import React, { useState } from "react";
import { bannerStyles, customStyles } from "../assets/dummyStyles";
import { features, floatingIcons } from "../assets/dummyBanner";
import { CircleCheckBig, Sparkles, X } from "lucide-react";
import bannerImg from "../assets/bannerImage1.jpeg";
import video from "../assets/BannerVideo.mp4";

function Banner() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className={bannerStyles.container}>
      {/* Floating Icons Wrapper */}
      <div className={bannerStyles.floatingIconsWrapper}>
        {floatingIcons.map((icon, i) => (
          <img
            key={i}
            src={icon.src}
            alt={icon.alt || ""}
            className={`${bannerStyles.floatingIcon} ${icon.pos}`}
            style={{
              animationDelay: `${i * 0.35}s`,
              willChange: "transform, opacity",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className={bannerStyles.mainContent}>
        <div className={bannerStyles.grid}>
          {/* Left Content */}
          <div className={bannerStyles.leftContent}>
            <span className={bannerStyles.badge}>
              <Sparkles className={bannerStyles.badgeIcon} />
              New Features available.
            </span>

            <h1 className={bannerStyles.heading}>
              <span className={bannerStyles.headingSpan1}>Build Amazing</span>
              <span className={bannerStyles.headingSpan2}>
                Digital Products
              </span>
            </h1>

            <p className={bannerStyles.description}>
              Create beautiful, responsive web applications with our powerful
              tools and components. Start building your next project today.
            </p>

            {/* Features */}
            <div className={bannerStyles.featuresGrid}>
              {features.map((feature, i) => (
                <div key={i} className={bannerStyles.featureItem}>
                  <div className={bannerStyles.featureIconContainer}>
                    <span
                      className={bannerStyles.featureIcon}
                      style={{
                        color: feature.color || "#6366f1",
                      }}
                    >
                      <CircleCheckBig size={16} />
                    </span>
                  </div>

                  <span className={bannerStyles.featureText}>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className={bannerStyles.buttonsContainer}>
              <a href="/course" className={bannerStyles.buttonGetStarted}>
                Get Start
              </a>

              <button
                type="button"
                className={bannerStyles.buttonViewDemo}
                onClick={() => setShowVideo(true)}
              >
                View Demo
              </button>
            </div>
          </div>

          {/* Right Banner Image */}
          <div
            className={`${bannerStyles.imageContainer} w-full flex items-center justify-center lg:justify-end`}
          >
            <img
              src={bannerImg}
              alt="Banner"
              className={`${bannerStyles.image} w-full max-w-[520px] h-auto max-h-[420px] object-contain rounded-2xl`}
            />
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showVideo && (
        <div
          className={bannerStyles.videoModal.overlay}
          onClick={() => setShowVideo(false)}
        >
          <div
            className={bannerStyles.videoModal.container}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={video}
              className={bannerStyles.videoModal.iframe}
              controls
              autoPlay
              playsInline
            />

            <button
              type="button"
              onClick={() => setShowVideo(false)}
              className={bannerStyles.videoModal.closeButton}
              aria-label="Close video"
            >
              <span>
                <X className={bannerStyles.videoModal.closeIcon} />
              </span>
            </button>
          </div>
        </div>
      )}

      <style>{customStyles}</style>

      {/* Inline Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Banner;
