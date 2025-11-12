"use client";
import React, { useState } from "react";
import { Send, Check } from "lucide-react";

function ConnectSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setEmail("");
    
    // Reset success state after 3 seconds
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-blue-100/30 to-blue-100/40">
      <div className="max-w-5xl mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the latest product reviews and buying guides delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-5xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-6 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0215A6] focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-400 shadow-sm text-lg"
                required
                disabled={isSubmitting || isSuccess}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || isSuccess || !email}
              className={`px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 min-w-[160px] text-lg ${
                isSuccess
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-[#0215A6] hover:bg-[#0215A6]/90 hover:shadow-lg'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending...</span>
                </>
              ) : isSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Subscribe</span>
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-4">
            No spam ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ConnectSection;