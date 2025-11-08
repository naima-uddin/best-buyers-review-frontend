"use client";
import React from "react";

function ReviewsSection() {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "New Parent",
      rating: 5,
      text: "BuyersGuide helped me find the perfect baby carrier! The detailed reviews and comparison charts saved me hours of research.",
      avatar: "/woman-portrait.png",
    },
    {
      name: "Michael Chen",
      role: "Tech Enthusiast",
      rating: 5,
      text: "I trust BuyersGuide for all my purchases. Their expert analysis and unbiased reviews are incredibly helpful.",
      avatar: "/thoughtful-man-portrait.png",
    },
    {
      name: "Emily Rodriguez",
      role: "Beauty Blogger",
      rating: 5,
      text: "The beauty product guides are amazing! I discovered so many great products I wouldn't have found otherwise.",
      avatar: "/woman-portrait-2.png",
    },
    {
      name: "David Thompson",
      role: "Home Improvement",
      rating: 5,
      text: "Best buying guide website out there. Love the detailed specifications and honest pros/cons for each product.",
      avatar: "/thoughtful-man-portrait.png",
    },
  ];

  // Star icon component
  const StarIcon = ({ filled = true, className = "" }) => (
    <svg
      className={`w-5 h-5 ${
        filled ? "text-yellow-400 fill-current" : "text-gray-300"
      } ${className}`}
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  // Quote icon component
  const QuoteIcon = ({ className = "" }) => (
    <svg
      className={`w-8 h-8 text-blue-500/20 ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  );

  return (
    <section className="max-w-7xl mx-auto  relative overflow-hidden py-10 mt-10">
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Why Shoppers Trust Us
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Join over{" "}
            <span className="font-bold text-blue-600">1 million+</span>{" "}
            satisfied shoppers who find the best products with our expert
            guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Gradient top border */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

              <div className="p-6">
                {/* Quote icon */}
                <div className="mb-4">
                  <QuoteIcon />
                </div>

                {/* Star rating */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} filled={i < review.rating} />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-gray-700 mb-6 leading-relaxed text-sm relative">
                  <span className="absolute -top-2 -left-1 text-2xl text-blue-200 font-serif">
                    "
                  </span>
                  {review.text}
                  <span className="absolute -bottom-4 -right-1 text-2xl text-blue-200 font-serif">
                    "
                  </span>
                </p>

                {/* Reviewer info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm relative">
                      {review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm">
                      {review.name}
                    </p>
                    <p className="text-gray-500 text-xs">{review.role}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      <span className="text-xs text-gray-400">
                        Verified Buyer
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm mb-6">
            Trusted by shoppers worldwide
          </p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">
                100% Unbiased Reviews
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Expert Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Real User Feedback</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
export default ReviewsSection;
