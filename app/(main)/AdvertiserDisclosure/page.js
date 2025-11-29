import AmazonAffiliateAdvertiserDisclosure from '@/page-components/HomePage/AmazonAffiliateAdvertiserDisclosure'
import React from 'react'
import Navbar from "@/components/common/Navbar";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import { Footer } from "@/components/common/Footer";

export const metadata = {
  title: "Advertiser Disclosure | Best Buyers View",
  description:
    "Learn about Best Buyers View's advertiser disclosure policy. We earn commissions through affiliate links when you purchase products through our recommendations.",
  keywords: [
    "advertiser disclosure",
    "affiliate disclosure",
    "Amazon affiliate",
    "commission disclosure",
    "transparency",
  ],
  alternates: {
    canonical: "https://www.bestbuyersview.com/AdvertiserDisclosure",
  },
  openGraph: {
    title: "Advertiser Disclosure | Best Buyers View",
    description:
      "Learn about our advertiser disclosure and how we earn commissions through affiliate links.",
    url: "https://www.bestbuyersview.com/AdvertiserDisclosure",
    siteName: "Best Buyers View",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function page() {
  return (
    <>
          <Navbar />
    <AmazonAffiliateAdvertiserDisclosure />
    <Footer />
      <ScrollToTopButton />
    </>
  )
}
