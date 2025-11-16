"use client"
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const Highlight = ({ children }) => (
  <span className="relative whitespace-nowrap">
    <span className="absolute inset-0 -skew-x-6 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-sm" />
    <span className="relative font-bold text-gray-900">{children}</span>
  </span>
);

const PolicySection = ({ title, children, delay = 0 }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8 border border-gray-100"
  >
    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
      {title}
    </h2>
    <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
      {children}
    </div>
  </motion.section>
);

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/20 py-16">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 group"
          >
            <svg
              className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg shadow-gray-200/50 border border-gray-100 mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              LAST UPDATED: DEC 2024
            </span>
          </div>
          
          <h1 className="text-5xl font-bold md:text-7xl mb-6">
            Privacy <Highlight>Policy</Highlight>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, 
            and protect your personal information when you use Best Buyers View.
          </p>
        </motion.section>

        {/* Information Collection */}
        <PolicySection title="Information We Collect" delay={0.1}>
          <p>
            When you visit Best Buyers View, we may collect certain information automatically, 
            including your IP address, browser type, operating system, referring URLs, 
            and information about your interactions with our site.
          </p>
          <p>
            If you leave comments or contact us through our forms, we collect the information 
            you provide, such as your name, email address, and any other details you choose to share.
          </p>
        </PolicySection>

        {/* Comments Section */}
        <PolicySection title="Comments" delay={0.2}>
          <p>
            When visitors leave comments on the site, we collect the data shown in the comments form, 
            and also the visitor's IP address and browser user agent string to help spam detection.
          </p>
          <p>
            An anonymized string created from your email address (also called a hash) may be provided 
            to the Gravatar service to see if you are using it. The Gravatar service privacy policy 
            is available{" "}
            <a
              href="https://automattic.com/privacy/"
              className="text-blue-600 underline hover:text-blue-700 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            . After approval of your comment, your profile picture is visible to the public in the context of your comment.
          </p>
        </PolicySection>

        {/* Media Section */}
        <PolicySection title="Media" delay={0.3}>
          <p>
            If you upload images to the website, you should avoid uploading images with embedded 
            location data (EXIF GPS) included. Visitors to the website can download and extract 
            any location data from images on the website.
          </p>
        </PolicySection>

        {/* Cookies Section */}
        <PolicySection title="Cookies" delay={0.4}>
          <p>
            If you leave a comment on our site, you may opt-in to saving your name, email address, 
            and website in cookies. These are for your convenience so that you do not have to fill 
            in your details again when you leave another comment. These cookies will last for one year.
          </p>
          <p>
            We use cookies to enhance your experience, analyze site traffic, and for advertising purposes. 
            You can control cookies through your browser settings.
          </p>
        </PolicySection>

        {/* Embedded Content Section */}
        <PolicySection title="Embedded Content from Other Websites" delay={0.5}>
          <p>
            Articles on this site may include embedded content (e.g., videos, images, articles, etc.). 
            Embedded content from other websites behaves in the exact same way as if the visitor has 
            visited the other website.
          </p>
          <p>
            These websites may collect data about you, use cookies, embed additional third-party tracking, 
            and monitor your interaction with that embedded content, including tracking your interaction 
            with the embedded content if you have an account and are logged in to that website.
          </p>
        </PolicySection>

        {/* Analytics & Tracking */}
        <PolicySection title="Analytics and Tracking" delay={0.6}>
          <p>
            We use Google Analytics and other tracking tools to understand how visitors interact with 
            our website. This helps us improve our content and user experience. The data collected is 
            aggregated and anonymized.
          </p>
          <p>
            As an Amazon Associate, we may use Amazon's tracking pixels to monitor affiliate link clicks 
            and conversions.
          </p>
        </PolicySection>

        {/* Data Sharing Section */}
        <PolicySection title="Who We Share Your Data With" delay={0.7}>
          <p>
            We do not sell your personal data to third parties. We may share information with:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Service providers who help us operate our website</li>
            <li>Analytics and advertising partners (in anonymized form)</li>
            <li>Legal authorities when required by law</li>
          </ul>
          <p>
            If you request a password reset, your IP address will be included in the reset email.
          </p>
        </PolicySection>

        {/* Data Retention Section */}
        <PolicySection title="How Long We Retain Your Data" delay={0.8}>
          <p>
            If you leave a comment, the comment and its metadata are retained indefinitely. 
            This is so we can recognize and approve any follow-up comments automatically instead 
            of holding them in a moderation queue.
          </p>
          <p>
            For users that register on our website (if any), we also store the personal information 
            they provide in their user profile. All users can see, edit, or delete their personal 
            information at any time (except they cannot change their username). Website administrators 
            can also see and edit that information.
          </p>
        </PolicySection>

        {/* User Rights Section */}
        <PolicySection title="Your Rights Over Your Data" delay={0.9}>
          <p>
            If you have an account on this site or have left comments, you can request to receive 
            an exported file of the personal data we hold about you, including any data you have 
            provided to us. You can also request that we erase any personal data we hold about you. 
            This does not include any data we are obliged to keep for administrative, legal, or 
            security purposes.
          </p>
          <p>
            You have the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
          </ul>
        </PolicySection>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Questions About Our Privacy Policy?
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            If you have any questions about this privacy policy or how we handle your data, 
            please don't hesitate to contact us.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Contact Us
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </motion.section>
      </div>
    </div>
  );
}