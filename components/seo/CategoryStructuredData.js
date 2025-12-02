// app/components/seo/CategoryStructuredData.js
"use server";
import React from "react";
import { slugify, createProductSlug } from "@/lib/slugify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

export default async function CategoryStructuredData({ 
  mainCategoryName, 
  subCategoryName, 
  subSubCategoryName = null,
  products = [] 
}) {
  // Build category URL based on hierarchy
  let categoryUrl;
  let categoryTitle;
  let categoryDescription;
  
  if (subSubCategoryName) {
    categoryUrl = `${SITE_URL}/category/${slugify(mainCategoryName)}/${slugify(subCategoryName)}/${slugify(subSubCategoryName)}`;
    categoryTitle = `Best ${subSubCategoryName} - ${subCategoryName} (${mainCategoryName}) Reviews`;
    categoryDescription = `Browse our curated collection of ${subSubCategoryName.toLowerCase()} products in ${subCategoryName.toLowerCase()}. Expert reviews and buying guides.`;
  } else {
    categoryUrl = `${SITE_URL}/category/${slugify(mainCategoryName)}/${slugify(subCategoryName)}`;
    categoryTitle = `Best ${subCategoryName} - ${mainCategoryName} Reviews`;
    categoryDescription = `Browse our curated collection of ${subCategoryName?.toLowerCase() || ""} products in ${mainCategoryName?.toLowerCase() || ""}. Expert reviews and buying guides.`;
  }
  
  const items = products.map((p, idx) => {
    // Build product URL based on category hierarchy
    let productUrl;
    if (subSubCategoryName) {
      productUrl = `${SITE_URL}/category/${slugify(mainCategoryName)}/${slugify(subCategoryName)}/${slugify(subSubCategoryName)}/${createProductSlug(p.title)}`;
    } else {
      productUrl = `${SITE_URL}/category/${slugify(mainCategoryName)}/${slugify(subCategoryName)}/${createProductSlug(p.title)}`;
    }
    
    return {
      "@type": "ListItem",
      position: idx + 1,
      url: productUrl,
      name: p.title || p.seo?.title || undefined,
      item: {
        "@type": "Product",
        name: p.title,
        image: p.images?.[0]?.url || undefined,
        description: p.seo?.description || p.description || undefined
      }
    };
  }).slice(0, 100);

  // Build breadcrumb list dynamically
  const breadcrumbItems = [
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
      "item": `${SITE_URL}/category/${slugify(mainCategoryName)}/${slugify(subCategoryName)}`
    }
  ];

  // Add sub-sub category to breadcrumb if exists
  if (subSubCategoryName) {
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 5,
      "name": subSubCategoryName,
      "item": categoryUrl
    });
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${categoryUrl}#collection`,
    name: categoryTitle,
    description: categoryDescription,
    url: categoryUrl,
    breadcrumb: {
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
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
