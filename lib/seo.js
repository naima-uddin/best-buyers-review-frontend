export function canonical(path) {
  return `https://bestbuyersview.com${path}`;
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
      url: "https://bestbuyersview.com",
      siteName: "Best Buyers View",
    },
  };
}
