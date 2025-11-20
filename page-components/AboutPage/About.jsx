"use client"
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Breadcrumbs from "@/ui/Breadcrumbs";
import BackButton from "@/ui/BackButton";

const Highlight = ({ children }) => (
  <span className="relative whitespace-nowrap">
    <span className="absolute inset-0 -skew-x-6 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-sm" />
    <span className="relative font-bold text-gray-900">{children}</span>
  </span>
);

const StatCard = ({ number, label, suffix = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center p-6"
  >
    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
      {number}{suffix}
    </div>
    <div className="text-gray-600 font-medium">{label}</div>
  </motion.div>
);

const CategoryPill = ({ category, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
  >
    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
      <span className="text-white font-bold text-sm">{icon}</span>
    </div>
    <span className="font-semibold text-gray-700">{category}</span>
  </motion.div>
);

export default function AboutUs() {
  const categories = [
    { name: "Baby", icon: "👶" },
    { name: "Beauty", icon: "💄" },
    { name: "Fashion", icon: "👗" },
    { name: "Fitness", icon: "💪" },
    { name: "Food", icon: "🍎" },
    { name: "Garden", icon: "🌿" },
    { name: "Gifts", icon: "🎁" },
    { name: "Health", icon: "❤️" },
    { name: "Home", icon: "🏠" },
    { name: "Money", icon: "💰" },
    { name: "Office", icon: "💼" },
    { name: "Outdoor", icon: "🌲" },
    { name: "Pets", icon: "🐾" },
    { name: "Sports", icon: "⚽" },
    { name: "Tech", icon: "📱" },
    { name: "Tools", icon: "🛠️" }
  ];

  return (
    <>
    <div className=" w-full bg-gradient-to-br from-white via-blue-50/20 to-purple-50/10 text-gray-800 py-4 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 ">
              <Breadcrumbs />
        <BackButton />
            </div>
      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Hero Section */}
        <section className="relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg shadow-gray-200/50 border border-gray-100 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TRUSTED REVIEWS SINCE 2020
              </span>
            </div>
            
            <h1 className="text-3xl font-bold md:text-4xl mb-6">
              About <Highlight>Best Buyers View</Highlight>
            </h1>
            
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
              Your trusted companion in the world of online shopping. We cut through the noise to bring you 
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> honest, comprehensive reviews </span>
              that help you make smarter buying decisions across 16 essential categories.
            </p>
          </motion.div>
        </section>

        {/* Statistics Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            <StatCard number="50K+" label="Products Reviewed" />
            <StatCard number="16" label="Categories" />
            <StatCard number="2M+" label="Monthly Readers" />
            <StatCard number="4.9" label="Average Rating" suffix="/5" />
          </div>
        </motion.section>

        {/* Our Story & Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Story */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
                Our Story
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Best Buyers View was born from a simple realization: <span className="font-semibold text-blue-600">online shopping is overwhelming.</span> 
                  With countless products, biased reviews, and marketing hype, finding the right purchase felt like a full-time job.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We started in 2020 as a small team of passionate shoppers and product researchers who wanted to create a 
                  <span className="font-semibold text-purple-600"> trustworthy resource for everyday buyers.</span> Today, we've grown into one of the 
                  most comprehensive affiliate review platforms, covering everything from baby gear to tech gadgets.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our mission is simple: provide <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  unbiased, detailed, and practical reviews</span> that help you spend your money wisely and get products that truly meet your needs.
                </p>
              </div>
            </div>

            {/* How We Work */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-lg border border-blue-100/50"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How We Test & Review</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Real-World Testing",
                    desc: "We use products in everyday scenarios, not just lab conditions"
                  },
                  {
                    title: "Long-Term Analysis",
                    desc: "We track performance over months to assess durability"
                  },
                  {
                    title: "Comparative Analysis",
                    desc: "Side-by-side comparisons with competing products"
                  },
                  {
                    title: "User Feedback",
                    desc: "We aggregate thousands of real customer experiences"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Categories Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Our Categories
              </h2>
              <p className="text-gray-600 mb-6">
                Comprehensive coverage across all aspects of your life
              </p>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category, index) => (
                  <CategoryPill 
                    key={category.name} 
                    category={category.name} 
                    icon={category.icon}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          </div>
          {/* Mission & Vision */}
            <div className="space-x-6 flex justify-between">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 shadow-lg border border-blue-100/50"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-4 shadow-lg">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To empower consumers with honest, comprehensive product reviews that simplify buying decisions 
                  and ensure every purchase brings satisfaction and value.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 shadow-lg border border-purple-100/50"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mr-4 shadow-lg">
                    <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Our Vision</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  To become the most trusted and comprehensive product review platform worldwide, 
                  setting the standard for transparency and reliability in affiliate marketing.
                </p>
              </motion.div>
            </div>
        {/* Values Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center"
        >
          <h2 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Why Trust Us?
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            The principles that make Best Buyers View your most reliable shopping companion
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Unbiased Reviews",
                desc: "We maintain strict editorial independence. Our reviews are never influenced by brands or advertisers.",
                icon: "⚖️",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Comprehensive Testing",
                desc: "Every product undergoes rigorous testing across multiple criteria to ensure thorough evaluation.",
                icon: "🔍",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Transparent Process",
                desc: "We clearly explain our testing methodology and maintain transparency about affiliate partnerships.",
                icon: "🔓",
                color: "from-green-500 to-emerald-500"
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-blue-200/30 transition-all duration-500 group hover:scale-105 border border-gray-100"
              >
                <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${value.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 text-2xl`}>
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {value.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="bg-gradient-to-r from-blue-300 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h2 className="text-4xl font-bold mb-4">Start Shopping Smarter Today</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join 2 million+ smart shoppers who trust Best Buyers View for honest product reviews across 16 categories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/category" className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform duration-300 shadow-lg">
              Explore Categories
            </Link>
            
          </div>
        </motion.section>
      </div>
    </div>
    </>
  );
}