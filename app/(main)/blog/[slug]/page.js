import ArticleStructuredData from "@/components/seo/ArticleStructuredData";
import BlogDetails from "@/page-components/BlogPage/BlogDetails";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bestbuyersview.com";

// Aggressive static generation
export const revalidate = 3600;
export const dynamic = 'force-static';
export const dynamicParams = true; // Generate new pages on-demand
export const fetchCache = 'force-cache';

// Generate static paths for all blogs at build time
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
      next: { revalidate: 3600 }
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
      next: { revalidate: 3600 },
      cache: 'force-cache',
      headers: { 
        'Accept': 'application/json',
        'Cache-Control': 'public, max-age=3600'
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
      <BlogDetails slug={params.slug} initialBlog={blog} />      <script
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
