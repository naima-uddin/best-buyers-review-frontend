import { slugify, createProductSlug } from "@/lib/slugify";

// Generate sitemap at build time for static export
export const dynamic = 'force-static';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchWithTimeout = async (fullUrl, timeoutMs = 15000) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(fullUrl, { signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  };

  const fetchJson = async (path, timeoutMs = 15000) => {
    if (!API_URL) return null;

    try {
      const res = await fetchWithTimeout(`${API_URL}${path}`, timeoutMs);
      if (!res.ok) {
        console.error(`❌ ${path} returned ${res.status}`);
        return null;
      }
      return await res.json();
    } catch (err) {
      console.error(`❌ ${path} fetch failed:`, err?.message || err);
      return null;
    }
  };

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

  let mainCategoryPages = [];
  let subCategoryPages = [];
  let subSubCategoryPages = [];
  let productPages = [];
  let blogPages = [];

  const limit = 100;
  const [categoriesData, blogData, firstProductPage] = await Promise.all([
    fetchJson('/categories'),
    fetchJson('/blog'),
    fetchJson(`/products?page=1&limit=${limit}`),
  ]);

  if (categoriesData && Array.isArray(categoriesData)) {
    categoriesData.forEach((mainCat) => {
      const mainSlug = slugify(mainCat.name);

      if (mainCat.children && mainCat.children.length > 0) {
        mainCat.children.forEach((subCat) => {
          if (subCat.level === 2) {
            const subSlug = slugify(subCat.name);
            subCategoryPages.push({
              url: `${baseUrl}/category/${mainSlug}/${subSlug}`,
              lastModified: new Date(subCat.updatedAt || Date.now()),
              changeFrequency: 'daily',
              priority: 0.8,
            });

            if (subCat.children && subCat.children.length > 0) {
              subCat.children.forEach((subSubCat) => {
                if (subSubCat.level === 3) {
                  const subSubSlug = slugify(subSubCat.name);
                  subSubCategoryPages.push({
                    url: `${baseUrl}/category/${mainSlug}/${subSlug}?${subSubSlug}`,
                    lastModified: new Date(subSubCat.updatedAt || Date.now()),
                    changeFrequency: 'weekly',
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

  const productItems = [];
  if (firstProductPage?.data) {
    productItems.push(...(firstProductPage.data.products || []));

    const totalPages = firstProductPage.data.pagination?.pages || 1;
    if (totalPages > 1) {
      const pageRequests = Array.from({ length: totalPages - 1 }, (_, index) =>
        fetchJson(`/products?page=${index + 2}&limit=${limit}`)
      );

      const productResults = await Promise.allSettled(pageRequests);
      productResults.forEach((result) => {
        if (result.status === 'fulfilled' && result.value?.data?.products) {
          productItems.push(...result.value.data.products);
        }
      });
    }
  }

  console.log(`📦 Processing ${productItems.length} products...`);
  productItems.forEach((product) => {
    const main = product.mainCategory?.name;
    const sub = product.subCategory?.name;
    const subSub = product.subSubCategory?.name;
    const title = product.title;

    if (!main || !sub || !title) return;

    const mainSlug = slugify(main);
    const subSlug = slugify(sub);
    const productSlug = createProductSlug(title, product._id);

    const productUrl = subSub
      ? `${baseUrl}/category/${mainSlug}/${subSlug}/${slugify(subSub)}/${productSlug}`
      : `${baseUrl}/category/${mainSlug}/${subSlug}/${productSlug}`;

    productPages.push({
      url: productUrl,
      lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: product.isFeatured ? 0.85 : 0.7,
    });
  });

  if (blogData?.data) {
    const blogs = Array.isArray(blogData.data) ? blogData.data : [];
    blogPages = blogs
      .filter((blog) => blog.published)
      .map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.dateModified
          ? new Date(blog.dateModified)
          : new Date(blog.datePublished || Date.now()),
        changeFrequency: 'weekly',
        priority: blog.isFeatured ? 0.8 : 0.7,
      }));

    console.log(`✅ Generated ${blogPages.length} blog URLs`);
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
