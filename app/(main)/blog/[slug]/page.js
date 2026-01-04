import ArticleStructuredData from "@/components/seo/ArticleStructuredData";
import BlogDetailsWrapper from "@/page-components/BlogPage/BlogDetailsWrapper";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

// Use ISR - pages are statically generated and revalidated on-demand
// This makes navigation instant (pre-rendered HTML)
export const revalidate = 60; // Revalidate every 60 seconds if needed

// Allow dynamic paths not generated at build time
export const dynamicParams = true;

// Generate static paths for all blogs at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
      cache: 'no-store' // Get fresh list at build time
    });
    const data = await res.json();
    const blogs = data.data || [];
    
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getBlog(slug) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
      headers: { 
        'Accept': 'application/json'
      }
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch blog: ${slug}`);
      return null;
    }
    
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlog(slug);

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
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
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
      <BlogDetailsWrapper slug={slug} initialBlog={blog} />
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
