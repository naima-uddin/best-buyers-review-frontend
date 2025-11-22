// Simple script to verify sitemap contains all products
// Run: node verify-sitemap.js

const https = require("https");
const http = require("http");

const sitemapUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`
  : "http://localhost:3000/sitemap.xml";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function fetchData(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(url.includes("/sitemap.xml") ? data : JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        });
      })
      .on("error", reject);
  });
}

async function verifySitemap() {
  console.log("\n🔍 Verifying Sitemap...\n");

  try {
    // Fetch all products from API
    console.log("1. Fetching products from API...");
    const productsData = await fetchData(`${apiUrl}/api/products`);
    const products = productsData.data?.products || [];
    console.log(`   ✓ Found ${products.length} products in database`);

    // Fetch sitemap
    console.log("\n2. Fetching sitemap.xml...");
    const sitemapXml = await fetchData(sitemapUrl);

    // Count product URLs in sitemap
    const productUrlMatches =
      sitemapXml.match(/<loc>.*?\/category\/.*?\/.*?\/.*?<\/loc>/g) || [];
    console.log(
      `   ✓ Found ${productUrlMatches.length} product URLs in sitemap`
    );

    // Extract and display sample URLs
    console.log("\n3. Sample product URLs from sitemap:");
    productUrlMatches.slice(0, 5).forEach((url, i) => {
      const cleanUrl = url.replace(/<\/?loc>/g, "");
      console.log(`   ${i + 1}. ${cleanUrl}`);
    });

    // Summary
    console.log("\n📊 Summary:");
    console.log(`   Products in DB: ${products.length}`);
    console.log(`   Products in Sitemap: ${productUrlMatches.length}`);

    if (products.length === productUrlMatches.length) {
      console.log("   ✅ All products are in the sitemap!");
    } else if (productUrlMatches.length > 0) {
      console.log(
        `   ⚠️  Mismatch detected (this is OK if some products are filtered)`
      );
    } else {
      console.log("   ❌ No products found in sitemap");
    }

    // Count other pages
    const blogUrls = (sitemapXml.match(/<loc>.*?\/blog\/.*?<\/loc>/g) || [])
      .length;
    const categoryUrls = (
      sitemapXml.match(/<loc>.*?\/category\/[^\/]+<\/loc>/g) || []
    ).length;
    const subCategoryUrls = (
      sitemapXml.match(/<loc>.*?\/category\/[^\/]+\/[^\/]+<\/loc>/g) || []
    ).length;

    console.log(`\n   Blog posts: ${blogUrls}`);
    console.log(`   Categories: ${categoryUrls}`);
    console.log(`   Subcategories: ${subCategoryUrls}`);

    console.log("\n✅ Verification complete!\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\nTip: Make sure your dev/production server is running");
    console.log("Dev: npm run dev");
    console.log("Prod: npm run build && npm start\n");
  }
}

verifySitemap();
