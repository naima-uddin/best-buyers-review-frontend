import { slugify, createProductSlug } from "@/lib/slugify";

// Revalidate the sitemap every 1 hour (3600 seconds)
export const revalidate = 3600;

// Ensure dynamic rendering for fresh data
export const dynamic = 'force-dynamic';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestbuyersview.com";

  // --------------------------------------------
  // Static pages
  // --------------------------------------------
  const staticPages = [
    { path: "", changeFreq: "daily", priority: 1 },
    { path: "/about", changeFreq: "monthly", priority: 0.7 },
    { path: "/category", changeFreq: "daily", priority: 0.9 },
    { path: "/blog", changeFreq: "daily", priority: 0.9 },
    { path: "/contact", changeFreq: "monthly", priority: 0.6 },
    { path: "/privacy", changeFreq: "yearly", priority: 0.5 },
    { path: "/terms", changeFreq: "yearly", priority: 0.5 },
    { path: "/AdvertiserDisclosure", changeFreq: "monthly", priority: 0.6 },
  ].map(({ path, changeFreq, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: changeFreq,
    priority: priority,
  }));

  // --------------------------------------------
  // Fetch dynamic categories + products
  // --------------------------------------------
  let categoryPages = [];
  let subCategoryPages = [];
  let productPages = [];

  try {
    const productRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      { 
        next: { revalidate: 3600 },
        cache: 'no-store'
      }
    );

    if (productRes.ok) {
      const productData = await productRes.json();
      const products = productData.data?.products || [];

      const categoriesSet = new Set();
      const subCategoriesSet = new Set();

      products.forEach((p) => {
        const main = p.mainCategory?.name;
        const sub = p.subCategory?.name;
        const id = p._id;
        const title = p.title;

        if (!main || !sub || !id) return;

        const mainSlug = slugify(main);
        const subSlug = slugify(sub);
        const productSlug = createProductSlug(title, id);

        categoriesSet.add(mainSlug);
        subCategoriesSet.add(`${mainSlug}/${subSlug}`);

        // Product Page
        productPages.push({
          url: `${baseUrl}/category/${mainSlug}/${subSlug}/${productSlug}`,
          lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
          changeFrequency: "daily",
          priority: 0.8,
        });
      });

      // Category pages
      categoryPages = [...categoriesSet].map((cat) => ({
        url: `${baseUrl}/category/${cat}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      }));

      // Subcategory pages
      subCategoryPages = [...subCategoriesSet].map((path) => ({
        url: `${baseUrl}/category/${path}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.error("Failed loading product sitemap:", err);
  }

  // --------------------------------------------
  // Fetch dynamic blogs
  // --------------------------------------------
  let blogPages = [];
  try {
    const blogRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog`,
      { 
        next: { revalidate: 3600 },
        cache: 'no-store'
      }
    );

    if (blogRes.ok) {
      const blogData = await blogRes.json();
      const blogs = blogData.data || [];

      blogPages = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.dateModified
          ? new Date(blog.dateModified)
          : new Date(blog.datePublished || new Date()),
        changeFrequency: "weekly",
        priority: 0.7,
      }));
    }
  } catch (err) {
    console.error("Failed loading blog sitemap:", err);
  }

  // --------------------------------------------
  // Final sitemap return
  // --------------------------------------------
  return [
    ...staticPages,
    ...categoryPages,
    ...subCategoryPages,
    ...productPages,
    ...blogPages,
  ];
}
