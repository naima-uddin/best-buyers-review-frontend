// components/seo/OrganizationSchema.js
"use server";
import React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

/**
 * Generate Organization structured data for SEO
 * @returns {React.Component} - Script tag with JSON-LD
 */
export default async function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": "Best Buyers View",
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/logo.png`,
      "width": 250,
      "height": 60
    },
    "description": "Best Buyers View provides comprehensive product reviews, comparisons, and buying guides to help consumers make informed purchase decisions.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/bestbuyersview",
      "https://facebook.com/bestbuyersview",
      "https://www.instagram.com/bestbuyersview"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": `${SITE_URL}/contact`,
      "availableLanguage": ["English"]
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "knowsAbout": [
      "Product Reviews",
      "Product Comparisons",
      "Buying Guides",
      "Consumer Electronics",
      "Home Products",
      "Baby Products",
      "Beauty Products",
      "Fitness Equipment"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
