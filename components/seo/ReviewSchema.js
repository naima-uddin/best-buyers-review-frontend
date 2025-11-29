// components/seo/ReviewSchema.js
"use server";
import React from "react";

/**
 * Generate standalone Review structured data for SEO
 * @param {object} review - Review details {itemReviewed: {name, type}, author, reviewRating, reviewBody, datePublished}
 * @returns {React.Component} - Script tag with JSON-LD
 */
export default async function ReviewSchema({ review }) {
  if (!review) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": review.itemReviewed?.type || "Product",
      "name": review.itemReviewed?.name
    },
    "author": {
      "@type": "Person",
      "name": review.author?.name || "Best Buyers View"
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": review.reviewRating?.ratingValue || 5,
      "bestRating": 5,
      "worstRating": 1
    },
    "reviewBody": review.reviewBody,
    "datePublished": review.datePublished,
    "publisher": {
      "@type": "Organization",
      "name": "Best Buyers View"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
