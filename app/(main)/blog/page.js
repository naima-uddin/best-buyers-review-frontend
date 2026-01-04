import { Footer } from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import BlogPage from "@/page-components/BlogPage/Blogpage";
import ScrollToTopButton from "@/ui/ScrollToTopButton";

// Force dynamic rendering for instant navigation (data comes from client cache)
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Blog | Best Buyers View",
  description:
    "Read the latest product reviews, buying guides, and insights from Best Buyers View. Get expert opinions on tech, home, beauty, fitness, and more.",
  keywords: [
    "Best Buyers View Blog",
    "Product Reviews",
    "Buying Guides",
    "Tech Reviews",
    "Home Product Reviews",
    "Beauty Reviews",
    "Fitness Products",
  ],
  alternates: {
    canonical: "https://www.bestbuyersview.com/blog",
  },
  openGraph: {
    title: "Blog | Best Buyers View",
    description:
      "Read the latest buying guides and product reviews from Best Buyers View.",
    url: "https://www.bestbuyersview.com/blog",
    siteName: "Best Buyers View",
    images: [
      {
        url: "/og-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Best Buyers View Blog",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Best Buyers View",
    description:
      "Explore in-depth product reviews and buying guides across all categories.",
    images: ["/og-blog.jpg"],
  },
};

// No server-side fetch needed - data comes from BlogCacheContext (prefetched on app load)
export default function Page() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Best Buyers View Blog",
    url: "https://www.bestbuyersview.com/blog",
    description:
      "Best Buyers View Blog delivers the latest buying guides, reviews, and product comparisons.",
    publisher: {
      "@type": "Organization",
      name: "Best Buyers View",
      logo: {
        "@type": "ImageObject",
        url: "https://www.bestbuyersview.com/logo.png",
      },
    },
  };

  return (
    <>
      <Navbar />
      <BlogPage />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogSchema),
        }}
      />

      <Footer />
      <ScrollToTopButton />
    </>
  );
}




