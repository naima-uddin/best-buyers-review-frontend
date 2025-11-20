"use client";
import React, { useEffect, useRef, useState } from "react";

function ReviewsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [animatedReviews, setAnimatedReviews] = useState([]);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setAnimatedReviews(reviews);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  // Star icon component
  const StarIcon = ({ filled = true, className = "", delay = 0 }) => (
    <svg
      className={`w-5 h-5 transition-all duration-500 ${
        filled 
          ? "text-yellow-400 fill-current transform hover:scale-125" 
          : "text-gray-300"
      } ${className}`}
      viewBox="0 0 20 20"
      style={{
        animationDelay: `${delay}ms`,
        animation: isVisible ? 'starPop 0.6s ease-out forwards' : 'none'
      }}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  // Quote icon component
  const QuoteIcon = ({ className = "" }) => (
    <svg
      className={`w-8 h-8 text-[#0215A6]/20 transition-transform duration-300 group-hover:scale-110 ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
    </svg>
  );

  return (
    <section ref={sectionRef} className="max-w-7xl mx-auto relative overflow-hidden py-4 md:py-8">
      {/* Background decorative elements */}
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0215A6]/10 border border-[#0215A6]/20 mb-6">
            <div className="w-2 h-2 bg-[#0215A6] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#0215A6]">Real Customer Stories</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-[#0215A6] to-[#667eea] bg-clip-text text-transparent">
            Why Shoppers Trust Us
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Join over{" "}
            <span className="font-bold text-[#0215A6]">1 million+</span>{" "}
            satisfied shoppers who find the best products with our expert guidance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-10 opacity-0'
              } hover:-translate-y-3 border border-gray-100 overflow-hidden`}
              style={{
                transitionDelay: `${idx * 200}ms`,
              }}
            >
              {/* Gradient top border */}
              <div className="h-1 bg-gradient-to-r from-[#0215A6] via-[#667eea] to-[#0215A6]"></div>

              <div className="p-6">
                {/* Quote icon */}
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  <QuoteIcon />
                </div>

                {/* Star rating */}
                <div className="flex mb-4 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      filled={i < review.rating} 
                      delay={i * 100 + idx * 200}
                    />
                  ))}
                </div>

                {/* Review text */}
                <p className="text-gray-700 mb-6 leading-relaxed text-sm relative">
                  <span className="absolute -top-2 -left-1 text-2xl text-[#0215A6]/30 font-serif">
                    "
                  </span>
                  {review.text}
                  <span className="absolute -bottom-4 -right-1 text-2xl text-[#0215A6]/30 font-serif">
                    "
                  </span>
                </p>

                {/* Reviewer info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 group-hover:border-[#0215A6]/20 transition-colors duration-300">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0215A6] to-[#667eea] flex items-center justify-center text-white font-semibold text-sm relative transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      {review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-sm group-hover:text-[#0215A6] transition-colors duration-300">
                      {review.name}
                    </p>
                    <p className="text-gray-500 text-xs">{review.role}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                      <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors duration-300">
                        Verified Buyer
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0215A6]/5 to-[#667eea]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
          ))}
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
        @keyframes starPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          70% {
            transform: scale(1.2);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
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