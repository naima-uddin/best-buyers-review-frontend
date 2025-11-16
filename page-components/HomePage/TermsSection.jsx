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

const TermsSection = ({ title, children, delay = 0 }) => (
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

const LegalNotice = ({ children }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 my-6">
    <div className="flex items-start gap-3">
      <svg className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      <div className="text-yellow-800">{children}</div>
    </div>
  </div>
);

export default function TermsOfService() {
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
              EFFECTIVE DATE: DEC 2024
            </span>
          </div>
          
          <h1 className="text-5xl font-bold md:text-7xl mb-6">
            Terms of <Highlight>Service</Highlight>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Please read these terms carefully before using Best Buyers View. By accessing our website, 
            you agree to be bound by these terms and conditions.
          </p>
        </motion.section>

        <LegalNotice>
          <strong>Important:</strong> These Terms of Service contain important information about your legal rights and obligations. By using our website, you agree to these terms.
        </LegalNotice>

        {/* Acceptance of Terms */}
        <TermsSection title="1. Acceptance of Terms" delay={0.1}>
          <p>
            By accessing and using Best Buyers View ("the Website"), you accept and agree to be bound by 
            the terms and provision of this agreement. If you do not agree to abide by these terms, 
            please do not use this site.
          </p>
          <p>
            We reserve the right to modify these terms at any time. You should check this page periodically 
            for changes. Your continued use of the Website following the posting of changes will mean that 
            you accept and agree to the changes.
          </p>
        </TermsSection>

        {/* Use License */}
        <TermsSection title="2. Use License" delay={0.2}>
          <p>
            Permission is granted to temporarily access the materials (information or software) on 
            Best Buyers View for personal, non-commercial transitory viewing only. This is the grant 
            of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose</li>
            <li>Attempt to decompile or reverse engineer any software contained on the Website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
          </ul>
          <p>
            This license shall automatically terminate if you violate any of these restrictions and 
            may be terminated by Best Buyers View at any time.
          </p>
        </TermsSection>

        {/* Affiliate Disclosure */}
        <TermsSection title="3. Affiliate Relationships" delay={0.3}>
          <p>
            Best Buyers View participates in various affiliate marketing programs, including the 
            Amazon Services LLC Associates Program. This means we may earn commissions on qualifying 
            purchases made through our links at no additional cost to you.
          </p>
          <p>
            Our affiliate relationships do not influence our content, reviews, or recommendations. 
            We always strive to provide honest, unbiased opinions to help you make informed purchasing decisions.
          </p>
          <p>
            Product prices and availability are subject to change. We are not responsible for price 
            changes or product availability on third-party sites.
          </p>
        </TermsSection>

        {/* User Content */}
        <TermsSection title="4. User Content" delay={0.4}>
          <p>
            By submitting content (including comments, reviews, or other materials) to our Website, 
            you grant us a non-exclusive, royalty-free, perpetual, and worldwide license to use, 
            modify, publicly display, reproduce, and distribute such content on our website and 
            affiliated platforms.
          </p>
          <p>
            You are responsible for the content you submit and must ensure it does not:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Violate any third-party rights (including copyright, trademark, or privacy rights)</li>
            <li>Contain defamatory, obscene, or unlawful material</li>
            <li>Include spam, promotional content, or commercial solicitation</li>
            <li>Contain false or misleading information</li>
          </ul>
          <p>
            We reserve the right to remove any user content that violates these terms.
          </p>
        </TermsSection>

        {/* Disclaimer */}
        <TermsSection title="5. Disclaimer" delay={0.5}>
          <p>
            The materials on Best Buyers View are provided on an 'as is' basis. We make no warranties, 
            expressed or implied, and hereby disclaim and negate all other warranties including, without 
            limitation, implied warranties or conditions of merchantability, fitness for a particular 
            purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <p>
            We do not warrant or make any representations concerning the accuracy, likely results, or 
            reliability of the use of the materials on our website or otherwise relating to such 
            materials or on any sites linked to this site.
          </p>
          <p>
            Our product reviews and recommendations are based on our research and opinion. We encourage 
            you to conduct your own research before making purchasing decisions.
          </p>
        </TermsSection>

        {/* Limitations */}
        <TermsSection title="6. Limitations" delay={0.6}>
          <p>
            In no event shall Best Buyers View or its suppliers be liable for any damages (including, 
            without limitation, damages for loss of data or profit, or due to business interruption) 
            arising out of the use or inability to use the materials on our website, even if we or 
            an authorized representative has been notified orally or in writing of the possibility 
            of such damage.
          </p>
          <p>
            Because some jurisdictions do not allow limitations on implied warranties, or limitations 
            of liability for consequential or incidental damages, these limitations may not apply to you.
          </p>
        </TermsSection>

        {/* Accuracy of Materials */}
        <TermsSection title="7. Accuracy of Materials" delay={0.7}>
          <p>
            The materials appearing on Best Buyers View could include technical, typographical, or 
            photographic errors. We do not warrant that any of the materials on our website are 
            accurate, complete, or current.
          </p>
          <p>
            We may make changes to the materials contained on our website at any time without notice. 
            However, we do not make any commitment to update the materials.
          </p>
          <p>
            Product specifications, prices, and availability are subject to change without notice. 
            We are not responsible for inaccuracies in product information provided by manufacturers 
            or retailers.
          </p>
        </TermsSection>

        {/* Links */}
        <TermsSection title="8. Links to Third-Party Sites" delay={0.8}>
          <p>
            Best Buyers View has not reviewed all of the sites linked to its website and is not 
            responsible for the contents of any such linked site. The inclusion of any link does 
            not imply endorsement by us of the site.
          </p>
          <p>
            Use of any such linked website is at the user's own risk. We recommend that you review 
            the terms and privacy policies of any third-party sites you visit.
          </p>
        </TermsSection>

        {/* Intellectual Property */}
        <TermsSection title="9. Intellectual Property" delay={0.9}>
          <p>
            All content on this website, including text, graphics, logos, images, and software, 
            is the property of Best Buyers View or its content suppliers and protected by 
            international copyright laws.
          </p>
          <p>
            The compilation of all content on this site is the exclusive property of Best Buyers View 
            and protected by international copyright laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, create derivative works of, publicly display, 
            or exploit any content from our website without our express written permission.
          </p>
        </TermsSection>

        {/* Governing Law */}
        <TermsSection title="10. Governing Law" delay={1.0}>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of 
            the United States and you irrevocably submit to the exclusive jurisdiction of the courts 
            in that location.
          </p>
        </TermsSection>

        {/* Contact Information */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Questions About Our Terms?
          </h2>
          <p className="text-gray-700 mb-6 text-lg">
            If you have any questions about these Terms of Service, please contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            <Link
              href="/privacy"
              className="inline-flex items-center border border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              View Privacy Policy
            </Link>
          </div>
        </motion.section>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center text-gray-500 text-sm pt-8 border-t border-gray-200"
        >
          <p>Last updated: December 2024</p>
        </motion.div>
      </div>
    </div>
  );
}