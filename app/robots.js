export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/login/", "/api/"],
      },
    ],
    sitemap: "https://bestbuyersview.com/sitemap.xml",
  };
}
