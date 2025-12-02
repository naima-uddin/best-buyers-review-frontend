// app/components/seo/ProductStructuredData.js
"use server"; // server component
import React from "react";
import { slugify, createProductSlug } from "@/lib/slugify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

// Helper function to generate correct product URL
const getProductUrl = (product) => {
  const mainSlug = slugify(product.mainCategory?.name || '');
  const subSlug = slugify(product.subCategory?.name || '');
  // Generate slug from title + ID
  const productSlug = createProductSlug(product.title, product._id);
  
  if (product.subSubCategory?.name) {
    const subSubSlug = slugify(product.subSubCategory.name);
    return `${SITE_URL}/category/${mainSlug}/${subSlug}/${subSubSlug}/${productSlug}`;
  }
  return `${SITE_URL}/category/${mainSlug}/${subSlug}/${productSlug}`;
};

export default async function ProductStructuredData({ product }) {
  if (!product) return null;

  const priceObj = product.price || {};
  const listPriceObj = product.listPrice || null;
  const rating = product.customRating || {};
  const images = (product.images || []).map(img => img.url).filter(Boolean);
  const productUrl = getProductUrl(product);

  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    name: product.title || product.seo?.title || "",
    image: images.length ? images : [`${SITE_URL}/og-image.jpg`],
    description: product.seo?.description || product.description || "",
    sku: product.asin || product._id,
    gtin: product.asin || undefined,
    mpn: product.asin || undefined,
    brand: {
      "@type": "Brand",
      name: product.brand || "Generic"
    },
    category: product.mainCategory?.name || undefined,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: (priceObj.currency || "USD"),
      price: (priceObj.amount != null ? String(priceObj.amount) : undefined),
      availability: product.availability ? (product.availability.includes("In Stock") ? "https://schema.org/InStock" : "https://schema.org/OutOfStock") : "https://schema.org/InStock",
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Best Buyers View"
      }
    },
    aggregateRating: rating && rating.reviewCount ? {
      "@type": "AggregateRating",
      ratingValue: rating.rating || 0,
      reviewCount: rating.reviewCount || 0,
      bestRating: 5,
      worstRating: 1
    } : undefined,
    review: (product.customReviews || []).map(r => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author || "Verified Buyer"
      },
      datePublished: r.date,
      reviewBody: r.content,
      name: r.title,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating != null ? r.rating : 5,
        bestRating: 5,
        worstRating: 1
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
