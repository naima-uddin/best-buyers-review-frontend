import { slugify, createProductSlug } from "@/lib/slugify";

// Revalidate the sitemap every 1 hour (3600 seconds)
export const revalidate = 3600;

// Ensure dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

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
  // Fetch hierarchical categories from backend
  // --------------------------------------------
  let mainCategoryPages = [];
  let subCategoryPages = [];
  let subSubCategoryPages = [];

  try {
    const categoryRes = await fetch(`${apiUrl}/categories`, {
      next: { revalidate: 3600 },
      cache: 'no-store'
    });

    if (categoryRes.ok) {
      const categories = await categoryRes.json();
      
      // Build category URLs based on hierarchy
      categories.forEach((mainCat) => {
        const mainSlug = slugify(mainCat.name);
        
        // Level 1: Main Category
        mainCategoryPages.push({
          url: `${baseUrl}/category/${mainSlug}`,
          lastModified: mainCat.updatedAt ? new Date(mainCat.updatedAt) : new Date(),
          changeFrequency: "daily",
          priority: 0.90,
        });

        // Level 2: Sub Categories
        if (mainCat.children && mainCat.children.length > 0) {
          mainCat.children.forEach((subCat) => {
            const subSlug = slugify(subCat.name);
            
            subCategoryPages.push({
              url: `${baseUrl}/category/${mainSlug}/${subSlug}`,
              lastModified: subCat.updatedAt ? new Date(subCat.updatedAt) : new Date(),
              changeFrequency: "daily",
              priority: 0.85,
            });

            // Level 3: Sub-Sub Categories
            if (subCat.children && subCat.children.length > 0) {
              subCat.children.forEach((subSubCat) => {
                const subSubSlug = slugify(subSubCat.name);
                
                subSubCategoryPages.push({
                  url: `${baseUrl}/category/${mainSlug}/${subSlug}/${subSubSlug}`,
                  lastModified: subSubCat.updatedAt ? new Date(subSubCat.updatedAt) : new Date(),
                  changeFrequency: "weekly",
                  priority: 0.80,
                });
              });
            }
          });
        }
      });
    }
  } catch (err) {
    console.error("❌ Failed loading category sitemap:", err);
  }

  // --------------------------------------------
  // Fetch all products with full reviews only
  // --------------------------------------------
  let productPages = [];

  try {
    // Fetch all products (you may need pagination for large datasets)
    let allProducts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const productRes = await fetch(
        `${apiUrl}/products?page=${page}&limit=100`,
        { 
          next: { revalidate: 3600 },
          cache: 'no-store'
        }
      );

      if (productRes.ok) {
        const productData = await productRes.json();
        const products = productData.data?.products || [];
        
        if (products.length === 0) {
          hasMore = false;
        } else {
          allProducts = [...allProducts, ...products];
          
          // Check if there are more pages
          const pagination = productData.data?.pagination;
          if (pagination && page >= pagination.pages) {
            hasMore = false;
          } else {
            page++;
          }
        }
      } else {
        hasMore = false;
      }
    }

    console.log(`✅ Fetched ${allProducts.length} total products for sitemap`);

    // Filter products: Only include products with isFullReview: true
    const fullReviewProducts = allProducts.filter(product => product.isFullReview === true);
    
    console.log(`✅ Filtered to ${fullReviewProducts.length} products with full reviews`);

    // Generate product URLs with proper category paths - ONLY for full review products
    // NOTE: Product URLs use only mainCategory/subCategory, NOT subSubCategory
    fullReviewProducts.forEach((product) => {
      const main = product.mainCategory?.name;
      const sub = product.subCategory?.name;
      const title = product.title;
      const id = product._id;

      if (!main || !sub || !id || !title) return;

      const mainSlug = slugify(main);
      const subSlug = slugify(sub);
      const productSlug = createProductSlug(title, id);

      // Product URLs always use: /category/main/sub/product-slug
      // Sub-sub category is NOT included in product detail URLs
      const productUrl = `${baseUrl}/category/${mainSlug}/${subSlug}/${productSlug}`;

      // Use SEO data if available, with higher priority for featured products
      const priority = product.isFeatured ? 0.85 : 0.75;
      
      productPages.push({
        url: productUrl,
        lastModified: product.lastUpdated 
          ? new Date(product.lastUpdated) 
          : (product.updatedAt ? new Date(product.updatedAt) : new Date()),
        changeFrequency: "weekly",
        priority: priority,
      });
    });
  } catch (err) {
    console.error("❌ Failed loading product sitemap:", err);
  }

  // --------------------------------------------
  // Fetch dynamic blogs
  // --------------------------------------------
  let blogPages = [];
  try {
    const blogRes = await fetch(`${apiUrl}/blog`, { 
      next: { revalidate: 3600 },
      cache: 'no-store'
    });

    if (blogRes.ok) {
      const blogData = await blogRes.json();
      const blogs = blogData.data || [];

      blogPages = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.dateModified
          ? new Date(blog.dateModified)
          : new Date(blog.datePublished || new Date()),
        changeFrequency: "weekly",
        priority: 0.70,
      }));
    }
  } catch (err) {
    console.error("❌ Failed loading blog sitemap:", err);
  }

  // --------------------------------------------
  // Final sitemap return with proper ordering
  // --------------------------------------------
  const sitemap = [
    ...staticPages,
    ...mainCategoryPages,
    ...subCategoryPages,
    ...subSubCategoryPages,
    ...productPages,
    ...blogPages,
  ];

  console.log(`✅ Generated sitemap with ${sitemap.length} URLs:
    - Static pages: ${staticPages.length}
    - Main categories: ${mainCategoryPages.length}
    - Sub categories: ${subCategoryPages.length}
    - Sub-sub categories: ${subSubCategoryPages.length}
    - Products (Full Reviews Only): ${productPages.length}
    - Blogs: ${blogPages.length}
  `);

  return sitemap;
}
