import ArticleStructuredData from "@/components/seo/ArticleStructuredData";
import BlogDetails from "@/page-components/BlogPage/BlogDetails";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bestbuyersview.com";

// Revalidate every 60 seconds (SEO + speed)
export const revalidate = 60;

async function getBlog(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`, {
    next: { revalidate: 60 },
  });
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found | Best Buyers View",
      description: "The requested blog post could not be found.",
      robots: "noindex",
    };
  }

  const image = blog.featuredImage?.url || "/default-blog.jpg";

  return {
    title: `${blog.seo?.title || blog.title} | Best Buyers View`,
    description: blog.seo?.description || blog.excerpt,
    keywords: blog.seo?.keywords || blog.tags,
    alternates: {
      canonical: `${SITE_URL}/blog/${blog.slug}`,
    },
    openGraph: {
      title: blog.title,
      description: blog.description || blog.excerpt,
      url: `${SITE_URL}/blog/${blog.slug}`,
      type: "article",
      publishedTime: blog.datePublished,
      modifiedTime: blog.dateModified,
      images: [{ url: image }],
      authors: [blog.author?.name || "Best Buyers View"],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description || blog.excerpt,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    return <div>Blog not found</div>;
  }

  // JSON-LD BlogPosting Schema
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.seo?.description || blog.excerpt,
    image: blog.featuredImage?.url || "/default-blog.jpg",
    author: {
      "@type": "Person",
      name: blog.author?.name || "Best Buyers View",
    },
    publisher: {
      "@type": "Organization",
      name: "Best Buyers View",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: blog.datePublished,
    dateModified: blog.dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${blog.slug}`,
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: blog.title,
        item: `${SITE_URL}/blog/${blog.slug}`,
      },
    ],
  };

  return (
    <>
    <ArticleStructuredData blog={blog} />
      <BlogDetails slug={params.slug} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
    </>
  );
}
