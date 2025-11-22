// app/components/seo/CategoryStructuredData.js
"use server";
import React from "react";
import { slugify, createProductSlug } from "@/lib/slugify";

export default async function CategoryStructuredData({ mainCategoryName, subCategoryName, products = [] }) {
  const items = products.map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `https://bestbuyersview.com/category/${slugify(mainCategoryName)}/${slugify(subCategoryName)}/${createProductSlug(p.title)}`,
    name: p.title || p.seo?.title || undefined
  })).slice(0, 100);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${subCategoryName || ""} (${mainCategoryName || ""})`,
    url: `https://bestbuyersview.com/category/${slugify(mainCategoryName)}/${slugify(subCategoryName)}`,
    mainEntity: {
      "@type": "ItemList",
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
