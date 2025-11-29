// app/components/seo/ArticleStructuredData.js
import React from "react";

/**
 * blog: object with fields { title, slug, seo, featuredImage, author: {name, url}, createdAt, updatedAt, excerpt, tags, faq (optional) }
 */
export default function ArticleStructuredData({ blog }) {
  if (!blog) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "description": blog.seo?.description || blog.excerpt || "",
    "image": blog.featuredImage?.url || "https://www.bestbuyersview.com/og-image.jpg",
    "author": {
      "@type": "Person",
      "name": blog.author?.name || "Best Buyers View"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Best Buyers View",
      "logo": { "@type": "ImageObject", url: "https://www.bestbuyersview.com/logo.png" }
    },
    "datePublished": blog.createdAt,
    "dateModified": blog.updatedAt || blog.createdAt,
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.bestbuyersview.com/blog/${blog.slug}` },
    "keywords": blog.tags || blog.seo?.keywords || []
  };

  // If blog has FAQ array [{question, answer}]


  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  );
}
