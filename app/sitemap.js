export default async function sitemap() {
  const baseUrl = "https://bestbuyersview.com";

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/category`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/AdvertiserDisclosure`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  try {
    // Fetch all products for dynamic URLs
    const productsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/all`,
      { cache: "no-store" }
    );

    let productPages = [];
    if (productsResponse.ok) {
      const productsData = await productsResponse.json();
      const products = productsData.data || [];

      productPages = products.map((product) => ({
        url: `${baseUrl}/category/${product.mainCategory?.name?.toLowerCase().replace(/\s+/g, "-")}/${product.subCategory?.name?.toLowerCase().replace(/\s+/g, "-")}/${product.asin}`,
        lastModified: product.updatedAt
          ? new Date(product.updatedAt)
          : new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }

    // Fetch all blog posts for dynamic URLs
    const blogsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/blog`,
      { cache: "no-store" }
    );

    let blogPages = [];
    if (blogsResponse.ok) {
      const blogsData = await blogsResponse.json();
      const blogs = blogsData.data || [];

      blogPages = blogs.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: blog.dateModified
          ? new Date(blog.dateModified)
          : new Date(blog.datePublished || new Date()),
        changeFrequency: "monthly",
        priority: 0.7,
      }));
    }

    return [...staticPages, ...productPages, ...blogPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return at least static pages if dynamic fetch fails
    return staticPages;
  }
}
