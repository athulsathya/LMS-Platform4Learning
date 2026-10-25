import React from "react";
import { motion } from "framer-motion";
import { facultyStyles } from "../assets/dummyStyles";
import sampleTeachers from "../assets/dummyFaculty";
import { Mail, Star } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

function FaculityPage() {
  return (
    <div className={facultyStyles.container}>
      {/* Header Section */}
      <div className={facultyStyles.header}>
        <div className={facultyStyles.headerContent}>
          <h1 className={facultyStyles.title}>Meet Our Faculty</h1>

          <div className={facultyStyles.titleDivider}></div>

          <p className={facultyStyles.subtitle}>
            Learn from industry experts and academic pioneers dedicated to your
            success.
          </p>
        </div>
      </div>

      {/* Faculty Section */}
      <div className={facultyStyles.facultySection}>
        <div className={facultyStyles.facultyContainer}>
          <div className={facultyStyles.facultyGrid}>
            {sampleTeachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.06,
                  duration: 0.5,
                }}
                className={facultyStyles.card}
              >
                <div className={facultyStyles.teacherCard}>
                  {/* Teacher Image */}
                  <div className={facultyStyles.imageContainer}>
                    <div className={facultyStyles.imageWrapper}>
                      <img
                        src={teacher.image}
                        alt={teacher.name}
                        className={facultyStyles.image}
                      />
                    </div>

                    {/* Experience Badge */}
                    <div className={facultyStyles.experienceBadge}>
                      <div className={facultyStyles.experienceBadgeContent}>
                        {teacher.experience}
                      </div>
                    </div>
                  </div>

                  {/* Teacher Information */}
                  <div className={facultyStyles.teacherInfo}>
                    <h3 className={facultyStyles.teacherName}>
                      {teacher.name}
                    </h3>

                    <p className={facultyStyles.teacherQualification}>
                      {teacher.qualification}
                    </p>

                    <p className={facultyStyles.teacherBio}>{teacher.bio}</p>
                  </div>

                  {/* Star Rating */}
                  <div className={facultyStyles.starRating}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`${facultyStyles.starIcon} ${
                          i < Math.round(teacher.initialRating ?? 0)
                            ? facultyStyles.starButtonActive
                            : facultyStyles.starButtonInactive
                        }`}
                      />
                    ))}
                  </div>

                  {/* Social Media Links */}
                  <div className={facultyStyles.socialContainer}>
                    {/* Email */}
                    {teacher.mail && (
                      <a
                        href={`mailto:${teacher.mail}`}
                        className={`${facultyStyles.socialIcon} ${facultyStyles.socialIconEmail}`}
                        title={`Email ${teacher.name}`}
                        aria-label={`Email ${teacher.name}`}
                      >
                        <Mail className={facultyStyles.socialIconSvg} />
                      </a>
                    )}

                    {/* Instagram */}
                    {teacher.instagram && (
                      <a
                        href={teacher.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={facultyStyles.socialIcon}
                        title={`Instagram - ${teacher.name}`}
                        aria-label={`${teacher.name} Instagram`}
                      >
                        <FaInstagram className={facultyStyles.socialIconSvg} />
                      </a>
                    )}

                    {/* LinkedIn */}
                    {teacher.linkedin && (
                      <a
                        href={teacher.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={facultyStyles.socialIcon}
                        title={`LinkedIn - ${teacher.name}`}
                        aria-label={`${teacher.name} LinkedIn`}
                      >
                        <FaLinkedin className={facultyStyles.socialIconSvg} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{facultyStyles.animations}</style>
    </div>
  );
}

export default FaculityPage;
