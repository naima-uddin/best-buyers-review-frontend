import BlogDetails from "@/page-components/BlogPage/BlogDetails";

export async function generateMetadata({ params }) {
  const { slug } = params;
  
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/slug/${slug}`);
    const data = await res.json();
    const blog = data.data;

    if (!blog) {
      return {
        title: "Blog Post Not Found | Best Buyers View",
        description: "The requested blog post could not be found.",
      };
    }

    return {
      title: `${blog.title} | Best Buyers View`,
      description: blog.description || blog.excerpt,
      keywords: blog.seo?.keywords || blog.tags,
      openGraph: {
        title: blog.title,
        description: blog.description || blog.excerpt,
        url: `https://bestbuyersview.com/blog/${blog.slug}`,
        type: "article",
        publishedTime: blog.datePublished,
        modifiedTime: blog.dateModified,
        authors: [blog.author?.name || "Best Buyers View"],
        images: blog.featuredImage?.url ? [blog.featuredImage.url] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.description || blog.excerpt,
        images: blog.featuredImage?.url ? [blog.featuredImage.url] : [],
      },
    };
  } catch (error) {
    return {
      title: "Blog Post | Best Buyers View",
      description: "Read this blog post on Best Buyers View",
    };
  }
}

export default function BlogPostPage({ params }) {
  return <BlogDetails slug={params.slug} />;
}