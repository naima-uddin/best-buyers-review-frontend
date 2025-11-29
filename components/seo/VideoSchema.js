// components/seo/VideoSchema.js
"use server";
import React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

/**
 * Generate VideoObject structured data for SEO
 * @param {object} video - Video details {name, description, thumbnailUrl, uploadDate, duration, contentUrl, embedUrl}
 * @returns {React.Component} - Script tag with JSON-LD
 */
export default async function VideoSchema({ video }) {
  if (!video) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.name,
    "description": video.description,
    "thumbnailUrl": video.thumbnailUrl,
    "uploadDate": video.uploadDate,
    "duration": video.duration, // Format: PT1M33S (1 minute 33 seconds)
    "contentUrl": video.contentUrl,
    "embedUrl": video.embedUrl,
    "publisher": {
      "@type": "Organization",
      "name": "Best Buyers View",
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/logo.png`
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
