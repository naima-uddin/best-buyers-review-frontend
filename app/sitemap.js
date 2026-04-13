import { slugify, createProductSlug } from "@/lib/slugify";

// Generate sitemap at build time for static export
export const dynamic = 'force-static';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  console.log('🗺️ Generating sitemap...');

  // --------------------------------------------
  // Static pages with optimized priorities
  // --------------------------------------------
  const staticPages = [
    { path: "", changeFreq: "daily", priority: 1.0 },
    { path: "/about", changeFreq: "monthly", priority: 0.6 },
    { path: "/category", changeFreq: "daily", priority: 0.95 },
    { path: "/blog", changeFreq: "daily", priority: 0.9 },
    { path: "/contact", changeFreq: "monthly", priority: 0.5 },
    { path: "/privacy", changeFreq: "yearly", priority: 0.3 },
    { path: "/terms", changeFreq: "yearly", priority: 0.3 },
    { path: "/AdvertiserDisclosure", changeFreq: "monthly", priority: 0.4 },
  ].map(({ path, changeFreq, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority: priority,
  }));

  // --------------------------------------------
  // Fetch categories from dedicated endpoint
  // --------------------------------------------
  let mainCategoryPages = [];
  let subCategoryPages = [];
  let subSubCategoryPages = [];

  try {
    const categoryRes = await fetch(`${API_URL}/categories`);

    if (categoryRes.ok) {
      const categories = await categoryRes.json();
      
      // Process hierarchical category structure
      categories.forEach((mainCat) => {
        const mainSlug = slugify(mainCat.name);
        

        
        // Process subcategories
        if (mainCat.children && mainCat.children.length > 0) {
          mainCat.children.forEach((subCat) => {
            if (subCat.level === 2) {
              const subSlug = slugify(subCat.name);
              
              // Add subcategory page (e.g., /category/outdoor/air-compressors)
              subCategoryPages.push({
                url: `${baseUrl}/category/${mainSlug}/${subSlug}`,
                lastModified: new Date(subCat.updatedAt || Date.now()),
                changeFrequency: "daily",
                priority: 0.80,
              });

              // Process sub-subcategories
              if (subCat.children && subCat.children.length > 0) {
                subCat.children.forEach((subSubCat) => {
                  if (subSubCat.level === 3) {
                    const subSubSlug = slugify(subSubCat.name);
                    
                    // Add sub-subcategory page with query param (e.g., /category/outdoor/air-compressors?air-inflator)
                    subSubCategoryPages.push({
                      url: `${baseUrl}/category/${mainSlug}/${subSlug}?${subSubSlug}`,
                      lastModified: new Date(subSubCat.updatedAt || Date.now()),
                      changeFrequency: "weekly",
                      priority: 0.75,
                    });
                  }
                });
              }
            }
          });
        }
      });

      console.log(`✅ Categories: ${mainCategoryPages.length} main, ${subCategoryPages.length} sub, ${subSubCategoryPages.length} sub-sub`);
    }
  } catch (err) {
    console.error("❌ Failed loading category sitemap:", err);
  }

  // --------------------------------------------
  // Fetch all products for product pages
  // --------------------------------------------
  let productPages = [];

  try {
    // Fetch all products with pagination
    let allProducts = [];
    let page = 1;
    let hasMore = true;
    const limit = 100; // Fetch 100 products per page

    while (hasMore) {
      const productRes = await fetch(`${API_URL}/products?page=${page}&limit=${limit}`);

      if (productRes.ok) {
        const productData = await productRes.json();
        const products = productData.data?.products || [];
        
        if (products.length === 0) {
          hasMore = false;
        } else {
          allProducts = [...allProducts, ...products];
          
          // Check if we have more pages
          const pagination = productData.data?.pagination;
          if (pagination && page >= pagination.pages) {
            hasMore = false;
          }
          
          page++;
        }
      } else {
        hasMore = false;
      }
    }

    console.log(`📦 Processing ${allProducts.length} products...`);

    // Generate product URLs based on category hierarchy
    allProducts.forEach((product) => {
      const main = product.mainCategory?.name;
      const sub = product.subCategory?.name;
      const subSub = product.subSubCategory?.name;
      const title = product.title;

      if (!main || !sub || !title) return;

      const mainSlug = slugify(main);
      const subSlug = slugify(sub);
      // Generate slug from title + ID
      const productSlug = createProductSlug(title, product._id);

      let productUrl;
      
      if (subSub) {
        // Product with sub-sub-category: /category/main/sub/subsub/product-slug
        const subSubSlug = slugify(subSub);
        productUrl = `${baseUrl}/category/${mainSlug}/${subSlug}/${subSubSlug}/${productSlug}`;
      } else {
        // Product without sub-sub-category: /category/main/sub/product-slug
        productUrl = `${baseUrl}/category/${mainSlug}/${subSlug}/${productSlug}`;
      }

      productPages.push({
        url: productUrl,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: "weekly",
        priority: product.isFeatured ? 0.85 : 0.70,
      });
    });

    console.log(`✅ Generated ${productPages.length} product URLs`);
  } catch (err) {
    console.error("❌ Failed loading product sitemap:", err);
  }

  // --------------------------------------------
  // Fetch dynamic blogs
  // --------------------------------------------
  let blogPages = [];
  
  try {
    const blogRes = await fetch(`${API_URL}/blog`);

    if (blogRes.ok) {
      const blogData = await blogRes.json();
      const blogs = blogData.data || [];

      blogPages = blogs
        .filter(blog => blog.published) // Only include published blogs
        .map((blog) => ({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastModified: blog.dateModified
            ? new Date(blog.dateModified)
            : new Date(blog.datePublished || Date.now()),
          changeFrequency: "weekly",
          priority: blog.isFeatured ? 0.80 : 0.70,
        }));

      console.log(`✅ Generated ${blogPages.length} blog URLs`);
    }
  } catch (err) {
    console.error("❌ Failed loading blog sitemap:", err);
  }

  // --------------------------------------------
  // Final sitemap return with all URLs
  // --------------------------------------------
  const allPages = [
    ...staticPages,
    ...mainCategoryPages,
    ...subCategoryPages,
    ...subSubCategoryPages,
    ...productPages,
    ...blogPages,
  ];

  console.log(`🗺️ Total sitemap entries: ${allPages.length}`);

  return allPages;
}
