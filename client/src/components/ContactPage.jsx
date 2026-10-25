import React, { useState } from "react";
import { contactStyles } from "../assets/dummyStyles";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  Mailbox,
  MessageCircle,
  MessageCircleDashed,
  MessageSquare,
  Phone,
  SendHorizontal,
  User,
} from "lucide-react";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      setPhoneError("");

      // Allow only numbers and maximum 10 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        phone: numericValue,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate phone number
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  // Validate complete form
  const isFormValid =
    formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    validatePhone(formData.phone) &&
    formData.subject.trim() !== "" &&
    formData.message.trim() !== "";

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validatePhone(formData.phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    if (!isFormValid) return;

    setIsSubmitting(true);

    const whatsappMessage =
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Subject: ${formData.subject}\n` +
      `Message: ${formData.message}`;

    const whatsappUrl = `https://wa.me/917510376584?text=${encodeURIComponent(
      whatsappMessage,
    )}`;

    // Open WhatsApp in a new tab
    const whatsappWindow = window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );

    // Reset only when the browser opens the new tab
    if (whatsappWindow) {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setPhoneError("");
    } else {
      // Fallback if the browser blocks the new tab
      window.location.href = whatsappUrl;
    }

    setIsSubmitting(false);
  };

  return (
    <div className={contactStyles.container}>
      <div className={contactStyles.mainContainer}>
        {/* Header */}
        <div className={contactStyles.header}>
          <h1 className={contactStyles.title}>Contact Us</h1>
        </div>

        <div className={contactStyles.mainSection}>
          {/* Contact Form */}
          <div className={contactStyles.formContainer}>
            <div className={contactStyles.formGlow1}></div>
            <div className={contactStyles.formGlow2}></div>

            <div className={contactStyles.form}>
              <form
                className={contactStyles.formElements}
                onSubmit={handleSubmit}
              >
                {/* Name + Email */}
                <div className={contactStyles.formGrid}>
                  {/* Full Name */}
                  <div className={contactStyles.formGroup}>
                    <label
                      htmlFor="contact-name"
                      className={contactStyles.label}
                    >
                      <User
                        className={`${contactStyles.labelIcon} ${contactStyles.colors.purple.icon}`}
                      />
                      Full Name *
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      className={`${contactStyles.input} ${contactStyles.colors.purple.focus} ${contactStyles.colors.blue.hover}`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email */}
                  <div className={contactStyles.formGroup}>
                    <label
                      htmlFor="contact-email"
                      className={contactStyles.label}
                    >
                      <Mailbox
                        className={`${contactStyles.labelIcon} ${contactStyles.colors.blue.icon}`}
                      />
                      Email *
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      className={`${contactStyles.input} ${contactStyles.colors.blue.focus} ${contactStyles.colors.blue.hover}`}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className={contactStyles.formGroup}>
                  <label
                    htmlFor="contact-phone"
                    className={contactStyles.label}
                  >
                    <Phone
                      className={`${contactStyles.labelIcon} ${contactStyles.colors.green.icon}`}
                    />
                    Phone Number *
                  </label>

                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    autoComplete="tel-national"
                    aria-invalid={Boolean(phoneError)}
                    aria-describedby={
                      phoneError ? "contact-phone-error" : undefined
                    }
                    className={`${contactStyles.input} ${
                      contactStyles.colors.green.focus
                    } ${contactStyles.colors.green.hover} ${
                      phoneError ? contactStyles.inputError : ""
                    }`}
                    placeholder="Enter your phone number"
                  />

                  {phoneError && (
                    <p
                      id="contact-phone-error"
                      className={contactStyles.errorText}
                      role="alert"
                    >
                      {phoneError}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className={contactStyles.formGroup}>
                  <label
                    htmlFor="contact-subject"
                    className={contactStyles.label}
                  >
                    <MessageSquare
                      className={`${contactStyles.labelIcon} ${contactStyles.colors.purple.icon}`}
                    />
                    Subject *
                  </label>

                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`${contactStyles.select} ${contactStyles.colors.purple.focus}`}
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Project Collaboration">
                      Project Collaboration
                    </option>
                    <option value="Support">Support</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div className={contactStyles.formGroup}>
                  <label
                    htmlFor="contact-message"
                    className={contactStyles.label}
                  >
                    <MessageCircleDashed
                      className={`${contactStyles.labelIcon} ${contactStyles.colors.blue.icon}`}
                    />
                    Message *
                  </label>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className={`${contactStyles.textarea} ${contactStyles.colors.blue.focus}`}
                    placeholder="Tell me about your inquiry"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`${contactStyles.submitButton} ${
                    isFormValid && !isSubmitting
                      ? contactStyles.submitButtonEnabled
                      : contactStyles.submitButtonDisabled
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className={contactStyles.spinner}></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <SendHorizontal className={contactStyles.submitIcon} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Animation Section */}
          <div className={contactStyles.animationContainer}>
            <div className={contactStyles.animationWrapper}>
              <DotLottieReact
                src="https://lottie.host/9ccf026c-11e9-417a-9a9d-0169bc83e49d/sMK5FavyPC.lottie"
                loop
                autoplay
                style={{
                  width: "100%",
                  height: "500px",
                  filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.1))",
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer Information */}
        <div className={contactStyles.footer}>
          <div className={contactStyles.footerBadge}>
            <MessageCircle className={contactStyles.footerIcon} />

            <span className={contactStyles.footerText}>
              All messages are sent through WhatsApp for a quick response.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
