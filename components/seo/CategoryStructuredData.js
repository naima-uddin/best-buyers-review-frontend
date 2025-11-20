// app/components/seo/CategoryStructuredData.js
"use server";
import React from "react";

export default async function CategoryStructuredData({ mainCategoryName, subCategoryName, products = [] }) {
  const items = products.map((p, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `https://bestbuyersview.com/category/${encodeURIComponent(mainCategoryName).toLowerCase().replace(/\s+/g,'-')}/${encodeURIComponent(subCategoryName).toLowerCase().replace(/\s+/g,'-')}/${p._id}`,
    name: p.title || p.seo?.title || undefined
  })).slice(0, 100);

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${subCategoryName || ""} (${mainCategoryName || ""})`,
    url: `https://bestbuyersview.com/category/${encodeURIComponent(mainCategoryName).toLowerCase().replace(/\s+/g,'-')}/${encodeURIComponent(subCategoryName).toLowerCase().replace(/\s+/g,'-')}`,
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
