// components/seo/FAQSchema.js
"use server";
import React from "react";

/**
 * Generate FAQ structured data for SEO
 * @param {Array} faqs - Array of FAQ items [{question: string, answer: string}]
 * @returns {React.Component} - Script tag with JSON-LD
 */
export default async function FAQSchema({ faqs = [] }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
