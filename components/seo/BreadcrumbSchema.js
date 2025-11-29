// components/seo/BreadcrumbSchema.js
"use server";
import React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

/**
 * Generate BreadcrumbList structured data for SEO
 * @param {Array} items - Array of breadcrumb items [{name: string, url: string}]
 * @returns {React.Component} - Script tag with JSON-LD
 */
export default async function BreadcrumbSchema({ items = [] }) {
  if (!items || items.length === 0) return null;

  // Always add Home as the first item if not present
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    ...items.filter(item => item.name !== "Home")
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
