import React from "react";
import Link from "next/link";
import Breadcrumbs from "@/ui/Breadcrumbs";
import BackButton from "@/ui/BackButton";

const AmazonAffiliateAdvertiserDisclosure = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 pt-10 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs/>
        <BackButton />
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Amazon Affiliate Advertiser Disclosure
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-6 sm:p-8 border border-gray-100">
          <div className="prose prose-lg max-w-none">
            {/* Decorative elements */}
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              <span className="font-semibold text-gray-900">
                bestbuyersview.com
              </span>{" "}
              is a participant in the Amazon Services LLC Associates Program, an
              affiliate advertising program designed to provide a means for
              sites to earn advertising fees by advertising and linking to
              Amazon.com.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100 mb-6">
              <p className="text-gray-700 leading-relaxed text-lg">
                Some of the links on this website are "affiliate links." This
                means if you click on a link to Amazon, and then make a
                purchase, we may receive a small commission at no extra cost to
                you. Our use of these affiliate links does not affect the price
                you pay for any products, nor does it influence our editorial
                content.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              We only recommend products that we believe will be useful for our
              readers. Our reviews and opinions are our own. We strive to
              provide accurate information, though we cannot guarantee that
              every specification, price, or availability detail is always
              up-to-date; please verify before purchasing.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 text-yellow-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                Important Note
              </h3>
              <p className="text-yellow-700 text-lg">
                As an Amazon Associate, we earn from qualifying purchases. This 
                helps support our research and allows us to continue providing 
                free, unbiased product reviews to our readers.
              </p>
            </div>

            {/* Contact section */}
            <div className="bg-gray-50 p-6 rounded-xl mt-8 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Questions?
              </h3>
              <p className="text-gray-700 mb-3">
                If you have any questions about our disclosure, feel free to contact us.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Contact Us
                <svg
                  className="w-4 h-4 ml-1"
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
            </div>
          </div>
        </div>

        {/* Back to home link */}
        <div className="text-center mt-8">
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
      </div>
    </div>
  );
};

export default AmazonAffiliateAdvertiserDisclosure;