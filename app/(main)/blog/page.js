
import { Footer } from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import BlogPage from "@/page-components/BlogPage/Blogpage";
import ScrollToTopButton from "@/ui/ScrollToTopButton";

export const metadata = {
  title: "Blog | Best Buyers View | Product Reviews & Buying Guides",
  description:
    "Read the latest product reviews, buying guides, and insights from Best Buyers View. Get expert opinions on baby gear, tech gadgets, home products, and more.",
  keywords: [
    "Best Buyers View Blog",
    "Product Reviews",
    "Buying Guides",
    "Tech Reviews",
    "Home Product Reviews",
    "Baby Gear Reviews",
    "Beauty Product Reviews",
    "Fitness Equipment Reviews",
  ],
  alternates: {
    canonical: "https://bestbuyersview.com/blog",
  },
  openGraph: {
    title: "Blog | Best Buyers View | Product Reviews & Buying Guides",
    description:
      "Stay updated with Best Buyers View's blog featuring comprehensive product reviews, buying guides, and consumer insights across all categories.",
    url: "https://bestbuyersview.com/blog",
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
    title: "Blog | Best Buyers View | Product Reviews & Buying Guides",
    description:
      "Explore Best Buyers View's blog for expert product reviews, buying guides, and consumer insights across all categories.",
    images: ["/og-blog.jpg"],
  },
};

export default function Page() {
  return (
    <>
     <Navbar />
      <BlogPage />

      {/* Schema Markup for Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Best Buyers View Blog",
            url: "https://bestbuyersview.com/blog",
            description:
              "Best Buyers View Blog features comprehensive product reviews, buying guides, and consumer insights across all categories including tech, home, baby, beauty, and more.",
            publisher: {
              "@type": "Organization",
              name: "Best Buyers View",
              url: "https://bestbuyersview.com",
              logo: "https://bestbuyersview.com/logo.png",
            },
            blogPost: [],
          }),
        }}
      />

      <Footer/>
      <ScrollToTopButton/>
    </>
  );
}