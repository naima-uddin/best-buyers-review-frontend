// app/components/seo/CategoryStructuredData.js
"use server";
import React from "react";
import { slugify, createProductSlug } from "@/lib/slugify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

export default async function CategoryStructuredData({ mainCategoryName, subCategoryName, products = [] }) {
  const categoryUrl = `${SITE_URL}/category/${slugify(mainCategoryName)}/${slugify(subCategoryName)}`;
  
  const items = products.map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${SITE_URL}/category/${slugify(mainCategoryName)}/${slugify(subCategoryName)}/${createProductSlug(p.title)}`,
    name: p.title || p.seo?.title || undefined,
    item: {
      "@type": "Product",
      name: p.title,
      image: p.images?.[0]?.url || undefined,
      description: p.seo?.description || p.description || undefined
    }
  })).slice(0, 100);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${categoryUrl}#collection`,
    name: `Best ${subCategoryName || ""} - ${mainCategoryName || ""} Reviews`,
    description: `Browse our curated collection of ${subCategoryName?.toLowerCase() || ""} products in ${mainCategoryName?.toLowerCase() || ""}. Expert reviews and buying guides.`,
    url: categoryUrl,
    breadcrumb: {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Categories",
          "item": `${SITE_URL}/category`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": mainCategoryName,
          "item": `${SITE_URL}/category/${slugify(mainCategoryName)}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": subCategoryName,
          "item": categoryUrl
        }
      ]
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
