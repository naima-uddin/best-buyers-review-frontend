"use client";
import React from "react";
import { motion } from "framer-motion";

const Highlight = ({ children }) => (
  <span className="relative whitespace-nowrap">
    <span className="absolute inset-0 -skew-x-6 bg-gradient-to-r from-blue-400/40 via-blue-500/40 to-cyan-400/40 blur-sm" />
    <span className="relative font-semibold text-white drop-shadow-lg">
      {children}
    </span>
  </span>
);

export default function AboutUs() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-950 to-blue-900 text-blue-100 py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Hero Section */}
        <section className="relative text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold md:text-6xl mb-6"
          >
            <Highlight>About Best Buyers Review</Highlight>
          </motion.h1>
          <p className="text-blue-200 mt-4 max-w-3xl mx-auto text-lg leading-relaxed">
            At <span className="font-semibold text-cyan-300">Best Buyers Review</span>, 
            we are dedicated to helping customers make confident buying decisions. 
            Our platform provides transparent, data-driven product reviews 
            across categories like electronics, gadgets, and more — so you always 
            get the best value for your money.
          </p>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Company Intro Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-blue-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-700/30"
          >
            <h2 className="text-2xl font-bold text-cyan-300 mb-6">
              Who We Are
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/3">
                <img
                  src="/placeholder-image.jpg"
                  alt="Best Buyers Review Team"
                  className="rounded-2xl shadow-lg w-full object-cover"
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-blue-100 mb-4">
                  Founded with a vision to simplify shopping decisions, 
                  Best Buyers Review curates unbiased insights, ratings, 
                  and real user experiences. Our expert team tests and evaluates 
                  each product carefully before publishing reviews.
                </p>
                <p className="text-blue-100">
                  We combine trusted research methods and authentic feedback 
                  to create the most comprehensive buyer guides online — 
                  ensuring that you make smarter, faster, and more confident purchases.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-8 shadow-lg border border-blue-700/30"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-cyan-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-cyan-300">Our Mission</h2>
            </div>
            <p className="text-blue-100">
              To empower global consumers with honest, detailed, 
              and research-backed product reviews — helping them 
              choose the best products confidently.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl p-8 shadow-lg border border-blue-700/30"
          >
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-cyan-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-cyan-300">Our Vision</h2>
            </div>
            <p className="text-blue-100">
              To become the world’s most trusted product review platform, 
              guiding millions of buyers to make informed decisions 
              through transparency, research, and innovation.
            </p>
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-blue-900/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-blue-700/30"
        >
          <h2 className="text-2xl font-bold text-cyan-300 mb-8 text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Integrity",
                desc: "Every review is honest, unbiased, and data-driven.",
              },
              {
                title: "Quality",
                desc: "We maintain high editorial standards for every review and guide.",
              },
              {
                title: "Innovation",
                desc: "We continuously improve how we research and analyze products.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="text-center p-6 bg-blue-800/30 rounded-xl"
              >
                <div className="w-14 h-14 mx-auto rounded-full bg-cyan-400/20 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-cyan-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-blue-200 text-sm">{value.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
