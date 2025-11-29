// components/seo/HowToSchema.js
"use server";
import React from "react";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

/**
 * Generate HowTo structured data for SEO
 * @param {object} howTo - HowTo guide {name, description, totalTime, steps: [{name, text, image?, url?}], supplies?, tools?}
 * @returns {React.Component} - Script tag with JSON-LD
 */
export default async function HowToSchema({ howTo }) {
  if (!howTo || !howTo.steps || howTo.steps.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howTo.name,
    "description": howTo.description,
    "totalTime": howTo.totalTime, // Format: PT30M (30 minutes)
    "step": howTo.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      "image": step.image || undefined,
      "url": step.url || undefined
    })),
    "supply": howTo.supplies?.map(supply => ({
      "@type": "HowToSupply",
      "name": supply
    })) || undefined,
    "tool": howTo.tools?.map(tool => ({
      "@type": "HowToTool",
      "name": tool
    })) || undefined
  };

  // Remove undefined properties
  const cleanSchema = JSON.parse(JSON.stringify(schema, (key, value) => 
    value === undefined ? undefined : value
  ));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanSchema) }}
    />
  );
}
