export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/login/", "/api/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
