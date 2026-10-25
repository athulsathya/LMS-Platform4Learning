
import React, { useState } from "react";
import { contactStyles } from "../assets/dummyStyles";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Mailbox, MessageSquare, Phone, User } from "lucide-react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") setPhoneError("");

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      setPhoneError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);

    const whatsappMessage =
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Subject: ${formData.subject}\n` +
      `Message: ${formData.message}`;

    const whatsappUrl = `https://wa.me/917510376584?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");

    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setIsSubmitting(false);
      setPhoneError("");
    }, 2000);
  };

  const isFormValid =
    formData.name &&
    formData.email &&
    validatePhone(formData.phone) &&
    formData.subject &&
    formData.message;

  return (
    <div className={contactStyles.container}>
      <div className={contactStyles.mainContainer}>
        <div className={contactStyles.header}>
          <h1 className={contactStyles.title}>Contact Us</h1>
        </div>

        <div className={contactStyles.mainContainer}>
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
                  <div className={contactStyles.formGroup}>
                    <label className={contactStyles.label}>
                      <User
                        className={`${contactStyles.labelIcon} ${contactStyles.colors.purple.icon}`}
                      />
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="name"
                      onChange={handleChange}
                      value={formData.name}
                      required
                      className={`${contactStyles.input} ${contactStyles.colors.purple.focus} ${contactStyles.colors.blue.hover}`}
                      placeholder="Enter Your Full name"
                    />
                  </div>

                  <div className={contactStyles.formGroup}>
                    <label className={contactStyles.label}>
                      <Mailbox
                        className={`${contactStyles.labelIcon} ${contactStyles.colors.blue.icon}`}
                      />
                      Email *
                    </label>

                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      value={formData.email}
                      required
                      className={`${contactStyles.input} ${contactStyles.colors.blue.focus} ${contactStyles.colors.blue.hover}`}
                      placeholder="Enter Your Email"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className={contactStyles.formGroup}>
                  <label className={contactStyles.label}>
                    <Phone
                      className={`${contactStyles.labelIcon} ${contactStyles.colors.green.icon}`}
                    />
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    inputMode="numeric"
                    maxLength={10}
                    className={`${contactStyles.input} ${
                      contactStyles.colors.green.focus
                    } ${contactStyles.colors.green.hover} ${
                      phoneError ? contactStyles.inputError : ""
                    }`}
                    placeholder="Enter your phone number"
                  />

                  {phoneError && (
                    <p className={contactStyles.errorText}>
                      {phoneError}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className={contactStyles.formGroup}>
                  <label className={contactStyles.label}>
                    <MessageSquare
                      className={`${contactStyles.labelIcon} ${contactStyles.colors.purple.icon}`}
                    />
                    Subject *
                  </label>

                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`${contactStyles.select} ${contactStyles.colors.purple.focus}`}
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">
                      General Inquiry
                    </option>
                    <option value="Project Collaboration">
                      Project Collaboration
                    </option>
                    <option value="Support">Support</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
