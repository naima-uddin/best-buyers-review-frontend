export default function manifest() {
  return {
    name: "Best Buyers View - Product Reviews & Comparisons",
    short_name: "Best Buyers View",
    description:
      "Discover, Compare & Pick the Best products with expert reviews and buying guides",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
    categories: ["shopping", "lifestyle", "productivity"],
    lang: "en-US",
    dir: "ltr",
  };
}
