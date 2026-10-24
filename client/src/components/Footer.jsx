import React from "react";

import {
  footerStyles,
  footerBackgroundStyles,
  contactIconGradients,
  iconColors,
  footerCustomStyles,
} from "../assets/dummyStyles";

import {
  socialIcons,
  quickLinks,
  supportLinks,
  contactInfo,
} from "../assets/dummyFooter";

import logo from "../assets/logo.png";

import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  BookOpen,
  Users,
  FileText,
  HelpCircle,
  Shield,
  HandHelping,
  Globe,
} from "lucide-react";

import { FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  const iconMap = {
    Twitter: FaTwitter,
    Instagram: FaInstagram,
    Linkedin: FaLinkedin,
    LinkedIn: FaLinkedin,
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    BookOpen,
    Users,
    FileText,
    HelpCircle,
    Shield,
    HandHelping,
    Globe,
  };

  const contactItems = [
    {
      iconKey: "MapPin",
      label: "Address",
      value: `${contactInfo.addressLine1}, ${contactInfo.city}`,
    },
    {
      iconKey: "Phone",
      label: "Phone",
      value: contactInfo.phone,
      description: contactInfo.phoneHours,
      href: `tel:${contactInfo.phone.replace(/\s/g, "")}`,
    },
    {
      iconKey: "Mail",
      label: "Email",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      iconKey: "Globe",
      label: "Website",
      value: contactInfo.website,
      href: contactInfo.website,
    },
  ];

  return (
    <footer className={footerStyles.footer}>
      {/* Background effects */}
      <div className={footerBackgroundStyles.backgroundContainer}>
        <div className={footerBackgroundStyles.floatingOrb1}></div>
        <div className={footerBackgroundStyles.floatingOrb2}></div>
        <div className={footerBackgroundStyles.floatingOrb3}></div>
        <div className={footerBackgroundStyles.floatingOrb4}></div>

        {/* Subtle grid overlay */}
        <div className={footerBackgroundStyles.gridOverlay}>
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(
                  rgba(99, 102, 241, 0.1) 1px,
                  transparent 1px
                ),
                linear-gradient(
                  90deg,
                  rgba(99, 102, 241, 0.1) 1px,
                  transparent 1px
                )
              `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {/* Footer content */}
      <div className={footerStyles.container}>
        <div className={footerStyles.grid}>
          {/* Brand section */}
          <div className={footerStyles.brandSection}>
            <div className={footerStyles.brandTransform}>
              <div className={footerStyles.brandContainer}>
                <div className={footerStyles.brandGradient}></div>

                <div className="relative font-serif flex items-center gap-3">
                  <img src={logo} alt="EduSure logo" className="w-12 h-12" />

                  <h2 className={footerStyles.brandTitle}>EduSure</h2>
                </div>
              </div>

              <p className={footerStyles.brandDescription}>
                Transform your learning journey with interactive courses and
                cutting edge educational technology designed for modern
                learners.
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className={`${footerStyles.sectionHeader} ${iconColors.cyan}`}>
              <ArrowRight className={footerStyles.sectionIcon} />
              Quick Links
            </h4>

            <ul className={footerStyles.linksList}>
              {quickLinks.map((link, index) => {
                const Icon = iconMap[link.iconKey] || ArrowRight;

                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`${footerStyles.linkItem} ${iconColors.cyan}`}
                      style={{
                        transitionDelay: `${index * 80}ms`,
                      }}
                    >
                      <Icon
                        className={`${footerStyles.linkIcon} ${iconColors.cyan}`}
                      />

                      <span className="turncake">{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support links */}
          <div>
            <h4 className={`${footerStyles.sectionHeader} ${iconColors.cyan}`}>
              <HandHelping className={footerStyles.sectionIcon} />
              Support
            </h4>

            <ul className={footerStyles.linksList}>
              {supportLinks.map((link, index) => {
                const Icon = iconMap[link.iconKey] || HelpCircle;

                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`${footerStyles.linkItem} ${iconColors.cyan}`}
                      style={{
                        transitionDelay: `${index * 80}ms`,
                      }}
                    >
                      <Icon
                        className={`${footerStyles.linkIcon} ${iconColors.cyan}`}
                      />

                      <span>{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact section */}
          <div>
            <h4 className={`${footerStyles.sectionHeader} ${iconColors.cyan}`}>
              <Mail className={footerStyles.sectionIcon} />
              Contact Us
            </h4>

            <div className="space-y-4">
              {contactItems.map((contact, index) => {
                const Icon = iconMap[contact.iconKey] || Mail;

                return (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        contactIconGradients[contact.iconKey] || ""
                      }`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 mb-1">
                        {contact.label}
                      </p>

                      {contact.href ? (
                        <a
                          href={contact.href}
                          target={
                            contact.iconKey === "Globe" ? "_blank" : undefined
                          }
                          rel={
                            contact.iconKey === "Globe"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-sm text-gray-300 hover:text-white transition-colors break-words"
                        >
                          {contact.value}
                        </a>
                      ) : (
                        <p className="text-sm text-gray-300">{contact.value}</p>
                      )}

                      {contact.description && (
                        <p className="text-xs text-gray-400 mt-1">
                          {contact.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
          {socialIcons.map((social, index) => {
            const Icon = iconMap[social.iconKey] || ArrowRight;

            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className={`p-3 rounded-full bg-gradient-to-br ${social.color} text-white hover:scale-110 transition-all duration-300 shadow-lg`}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>

        {/* Bottom footer */}
        <div className="mt-10 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} EduSure. All rights reserved.
          </p>

          <p className="text-xs text-gray-500 mt-2">
            Designed by {contactInfo.designBy}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
