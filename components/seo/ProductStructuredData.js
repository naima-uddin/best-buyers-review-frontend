// app/components/seo/ProductStructuredData.js
"use server"; // server component
import React from "react";
import { slugify, createProductSlug } from "@/lib/slugify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bestbuyersview.com";

export default async function ProductStructuredData({ product }) {
  if (!product) return null;

  const priceObj = product.price || {};
  const listPriceObj = product.listPrice || null;
  const rating = product.customRating || {};
  const images = (product.images || []).map(img => img.url).filter(Boolean);

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title || product.seo?.title || "",
    image: images.length ? images : [`${SITE_URL}/og-image.jpg`],
    description: product.seo?.description || product.description || "",
    sku: product.asin || product._id,
    brand: {
      "@type": "Brand",
      name: product.brand || ""
    },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/category/${slugify(product.mainCategory?.name || "")}/${slugify(product.subCategory?.name || "")}/${createProductSlug(product.title)}`,
      priceCurrency: (priceObj.currency || "USD"),
      price: (priceObj.amount != null ? String(priceObj.amount) : undefined),
      availability: product.availability ? (product.availability.includes("In Stock") ? "https://schema.org/InStock" : "https://schema.org/OutOfStock") : undefined,
      priceValidUntil: undefined
    },
    aggregateRating: rating && rating.reviewCount ? {
      "@type": "AggregateRating",
      ratingValue: rating.rating || 0,
      reviewCount: rating.reviewCount || 0
    } : undefined,
    review: (product.customReviews || []).map(r => ({
      "@type": "Review",
      author: r.author || "User",
      datePublished: r.date,
      reviewBody: r.content,
      name: r.title,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating != null ? r.rating : 0
      }
    })).slice(0,5).filter(Boolean)
  };

  // Remove undefined fields recursively
  const clean = (obj) => {
    if (Array.isArray(obj)) return obj.map(clean).filter(v => v !== undefined);
    if (obj && typeof obj === "object") {
      const out = {};
      Object.entries(obj).forEach(([k, v]) => {
        const cv = clean(v);
        if (cv !== undefined && !(Array.isArray(cv) && cv.length === 0)) out[k] = cv;
      });
      return Object.keys(out).length ? out : undefined;
    }
    return obj === undefined ? undefined : obj;
  };

  const finalSchema = clean(schema);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(finalSchema) }}
    />
  );
}
