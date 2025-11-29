const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

export function canonical(path) {
  return `${SITE_URL}${path}`;
}

export function cleanSlug(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function defaultSEO() {
  return {
    title: "Best Buyers View",
    description:
      "Expert reviews, buying guides, and product insights to help you choose the best items.",
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: "Best Buyers View",
    },
  };
}
