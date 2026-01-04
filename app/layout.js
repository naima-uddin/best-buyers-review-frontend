import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import "hover.css/css/hover-min.css";
import { CategoryProvider } from "@/context/CategoryContext";
import { CompareProvider } from "@/context/CompareContext";
import { BlogCacheProvider } from "@/context/BlogCacheContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://www.bestbuyersview.com"),
  title: {
    default: "Best Buyers View | Product Reviews & Comparisons",
    template: "%s | Best Buyers View",
  },
  description:
    "Discover, Compare & Pick the Best products with expert reviews, comprehensive comparisons, and buying guides across tech, home, baby, beauty, fitness, and more categories.",
  keywords: [
    "product reviews",
    "product comparisons",
    "buying guides",
    "best products",
    "consumer reviews",
  ],
  authors: [{ name: "Best Buyers View" }],
  creator: "Best Buyers View",
  publisher: "Best Buyers View",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.bestbuyersview.com",
    siteName: "Best Buyers View",
    title: "Best Buyers View | Product Reviews & Comparisons",
    description:
      "Your trusted source for product reviews, comparisons, and buying guides.",
    images: [
      {
        url: "https://www.bestbuyersview.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Best Buyers View",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Best Buyers View | Product Reviews & Comparisons",
    description: "Discover, Compare & Pick the Best products",
    site: "@bestbuyersview",
    creator: "@bestbuyersview",
    images: ["https://www.bestbuyersview.com/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "LSauOgttifeBOx9fn6wJWtax-Vz2IOR0sD1ilyCg93o",
  },
};

export default function RootLayout({ children }) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.bestbuyersview.com/#organization",
        name: "Best Buyers View",
        url: "https://www.bestbuyersview.com",
        logo: "https://www.bestbuyersview.com/logo.png",
        sameAs: [
          "https://www.facebook.com/yourprofile",
          "https://www.instagram.com/yourprofile",
          "https://twitter.com/yourprofile",
          "https://www.youtube.com/yourchannel",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.bestbuyersview.com/#website",
        url: "https://www.bestbuyersview.com",
        name: "Best Buyers View",
        description: "Expert product reviews, comparisons and buying guides.",
        publisher: {
          "@id": "https://www.bestbuyersview.com/#organization",
        },
        potentialAction: {
          "@type": "SearchAction",
          target:
            "https://www.bestbuyersview.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://www.bestbuyersview.com/#webpage",
        url: "https://www.bestbuyersview.com",
        name: "Best Buyers View",
        isPartOf: {
          "@id": "https://www.bestbuyersview.com/#website",
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Organization + Website + WebPage + SearchAction JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        {/* Microsoft Clarity */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "uc4fjguyga");
            `,
          }}
        />

        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-10965368068"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-10965368068');
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <CategoryProvider>
            <CompareProvider>
              <BlogCacheProvider>{children}</BlogCacheProvider>
            </CompareProvider>
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
