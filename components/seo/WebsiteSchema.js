// components/seo/WebsiteSchema.js
"use server";
import React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

/**
 * Generate WebSite structured data for SEO (for sitelinks searchbox)
 * @returns {React.Component} - Script tag with JSON-LD
 */
export default async function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    "url": SITE_URL,
    "name": "Best Buyers View",
    "description": "Discover, Compare & Pick the Best products with expert reviews and comprehensive buying guides.",
    "publisher": {
      "@id": `${SITE_URL}/#organization`
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${SITE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "inLanguage": "en-US"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
