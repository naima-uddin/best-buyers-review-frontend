"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, MapPin, Globe, Clock, MessageCircle } from "lucide-react";
import BackButton from "@/ui/BackButton";
import Breadcrumbs from "@/ui/Breadcrumbs";

const ContactPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 py-8">
      <div className="px-4 max-w-7xl mx-auto">
        <Breadcrumbs/>
        {/* Back Button */}
        <BackButton />

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Get In <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Touch</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our reviews? Want to suggest a product? We'd love to hear from you!
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8 border border-gray-100">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-10">
            Contact Information
          </h2>

          {/* 🔥 Changed to 2 columns BUT SAME CONTENT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Email Us */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600">contact@bestbuyersview.com</p>
                <p className="text-gray-600">support@bestbuyersview.com</p>
                <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
              </div>
            </div>

            {/* Based In */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Based In</h3>
                <p className="text-gray-600">United States</p>
                <p className="text-sm text-gray-500 mt-1">Serving customers worldwide</p>
              </div>
            </div>

            {/* Response Time */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Response Time</h3>
                <p className="text-gray-600">24-48 Hours</p>
                <p className="text-sm text-gray-500 mt-1">Monday - Friday</p>
              </div>
            </div>

            {/* Website */}
            <div className="flex items-start gap-4 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Website</h3>
                <p className="text-gray-600">bestbuyersview.com</p>
                <p className="text-sm text-gray-500 mt-1">Your trusted review platform</p>
              </div>
            </div>
          </div>

          {/* Why Contact Us Section */}
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-4 text-lg">Why Contact Us?</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Product review requests</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Partnership opportunities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Feedback & suggestions</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">Technical support</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-8 border border-gray-100 mt-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How do you test products for reviews?",
                answer: "We conduct real-world testing, comparative analysis, and aggregate user feedback to provide comprehensive reviews."
              },
              {
                question: "Can I suggest a product for review?",
                answer: "Absolutely! We welcome product suggestions from our readers. Use the email above to submit your ideas."
              },
              {
                question: "Are your reviews biased?",
                answer: "No, we maintain strict editorial independence. Our reviews are never influenced by brands or advertisers."
              },
              {
                question: "How often do you update your reviews?",
                answer: "We regularly update our reviews as new products launch and existing products receive updates or new features."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors duration-200">
                <h3 className="font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
