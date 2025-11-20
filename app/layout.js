import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import "hover.css/css/hover-min.css";
import { CategoryProvider } from "@/context/CategoryContext";
import { CompareProvider } from "@/context/CompareContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://bestbuyersview.com"),
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
    url: "https://bestbuyersview.com",
    siteName: "Best Buyers View",
    title: "Best Buyers View | Product Reviews & Comparisons",
    description:
      "Your trusted source for product reviews, comparisons, and buying guides. Make informed purchase decisions with expert recommendations.",
    images: [
      {
        url: "https://bestbuyersview.com/og-image.jpg",
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
    images: ["https://bestbuyersview.com/og-image.jpg"],
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
    google: "your-google-verification-code", // Replace with actual Google Search Console verification code
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <CategoryProvider>
            <CompareProvider>
              {children}
            </CompareProvider>
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
