"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Phone, Mail, Truck, Shield, Clock, Headphones, Package, Globe, HelpCircle, RotateCcw, Users, Zap, MessageCircle, BarChart, CreditCard, Star, Link, TrendingUp, Users2, Download, Target, Image } from "lucide-react";
import BackButton from "@/ui/BackButton";
import Breadcrumbs from "@/ui/Breadcrumbs";

const CustomerSupport = () => {
  const router = useRouter();

  const supportServices = [
    {
      icon: Zap,
      title: "Affiliate Support",
      description: "Get help with commission tracking, link generation, and performance analytics for your affiliate campaigns.",
      color: "yellow"
    },
    {
      icon: BarChart,
      title: "Performance Analytics",
      description: "Real-time tracking of your affiliate performance, click-through rates, and earnings reports.",
      color: "blue"
    },
    {
      icon: CreditCard,
      title: "Payment Support",
      description: "Assistance with commission payments, payout methods, and payment schedule questions.",
      color: "green"
    },
    {
      icon: Users,
      title: "Partner Relations",
      description: "Dedicated support for affiliate partnerships, program updates, and collaboration opportunities.",
      color: "purple"
    }
  ];

  const contactChannels = [
    {
      icon: MessageCircle,
      title: "Affiliate Support",
      description: "Commission tracking, link issues, performance questions",
      contact: "contact@bestbuyersview.com",
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconColor: "text-blue-100",
      buttonColor: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Dashboard access, tracking issues, tool integration",
      contact: "support@bestbuyersview.com",
      bgColor: "bg-gradient-to-br from-green-500 to-green-600",
      iconColor: "text-green-100",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: Star,
      title: "Partnership Inquiries",
      description: "New partnerships, program features, collaboration ideas",
      contact: "contact@bestbuyersview.com",
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconColor: "text-purple-100",
      buttonColor: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  const responseTimes = [
    { type: "Commission Issues", time: "1-2 hours", color: "text-green-600" },
    { type: "Technical Support", time: "2-4 hours", color: "text-blue-600" },
    { type: "Payment Questions", time: "4-6 hours", color: "text-purple-600" },
    { type: "Partnership Inquiries", time: "24 hours", color: "text-yellow-600" }
  ];

  const faqs = [
  {
    question: "How do I find products to promote?",
    answer: "Browse our curated product catalog featuring top-performing items with high commission rates. We regularly update our selection with trending products and best-sellers.",
    icon: Target
  },
  {
    question: "How do I get my affiliate links?",
    answer: "After signing up, you'll get access to our link generator. Simply search for products in our catalog and generate unique affiliate links that track your commissions automatically.",
    icon: Link
  },
  {
    question: "When do I get paid for sales?",
    answer: "Commissions are processed monthly on the 15th. We track all sales through your links and you earn commissions when users make purchases on Amazon within 24 hours of clicking your link.",
    icon: CreditCard
  },
  {
    question: "What's the commission rate?",
    answer: "Commission rates vary by product category, typically ranging from 3-10%. We feature products with competitive rates and highlight high-commission opportunities in our dashboard.",
    icon: TrendingUp
  },
  {
    question: "Can I see which products are converting best?",
    answer: "Yes! Our dashboard shows real-time analytics including click-through rates, conversion rates, and earnings per product to help you optimize your promotions.",
    icon: BarChart
  },
  {
    question: "Do you provide product images and descriptions?",
    answer: "Absolutely! Access our content library with ready-to-use product images, feature lists, benefits, and pre-written promotional content to make your marketing easier.",
    icon: Image
  }
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      <div className="px-4 max-w-6xl mx-auto py-8">
        <Breadcrumbs />
        <BackButton />

        {/* Hero Section */}
        <div className="text-center mb-16 mt-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Headphones className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Customer <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Support</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dedicated support for our affiliate partners. Get help with commissions, tracking, payments, and maximizing your earnings.
          </p>
        </div>

        {/* Contact Grid - Enhanced with different styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contactChannels.map((channel, index) => (
            <div key={index} className="relative overflow-hidden group">
              <div className={`absolute inset-0 ${channel.bgColor} transform group-hover:scale-105 transition-transform duration-300 rounded-2xl`}></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 text-center group-hover:bg-white transition-all duration-300 m-1">
                <div className={`w-14 h-14 ${channel.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <channel.icon className={`w-7 h-7 ${channel.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{channel.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{channel.description}</p>
                <div className={`${channel.buttonColor} text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors inline-block`}>
                  {channel.contact}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Services - Completely Different Design */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Affiliate Support Services
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Comprehensive support designed specifically for affiliate marketers to help you succeed and grow your earnings
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportServices.map((service, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl transform group-hover:scale-105 transition-transform duration-300"></div>
                <div className="relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm group-hover:shadow-lg transition-all duration-300 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-${service.color}-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className={`w-6 h-6 text-${service.color}-600`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Time & Urgent Support */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Response Time Guarantee */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">Affiliate Response Times</h3>
            <p className="text-gray-600 text-center mb-6">We prioritize our affiliate partners with quick response guarantees</p>
            <div className="space-y-4">
              {responseTimes.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-white/80 rounded-xl shadow-sm backdrop-blur-sm">
                  <span className="font-semibold text-gray-700">{item.type}</span>
                  <span className={`font-bold ${item.color} bg-white px-3 py-1 rounded-full text-sm`}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Urgent Support */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Urgent  Issues?</h3>
            <p className="text-gray-600 mb-6">For immediate assistance or critical tracking issues:</p>
            <div className="text-2xl font-bold text-red-600 mb-2">contact@bestbuyersview.com</div>
            <p className="text-sm text-gray-500">Priority Affiliate Support • 24/7 Monitoring</p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg border border-gray-100 p-8 mb-12">
          <h2 className="text-3xl font-bold text-center mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Affiliate FAQ
            </span>
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Common questions from our affiliate partners about commissions, tracking, and program details
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 group border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <faq.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-3 text-lg group-hover:text-blue-600 transition-colors">{faq.question}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <h3 className="text-2xl font-bold mb-4">Ready to Maximize Your Earnings?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of successful affiliates who trust BestBuyersView for reliable commissions and outstanding support.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Contact Partnership Team⬆️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;