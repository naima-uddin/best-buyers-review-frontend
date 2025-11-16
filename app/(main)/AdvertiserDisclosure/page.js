import AmazonAffiliateAdvertiserDisclosure from '@/page-components/HomePage/AmazonAffiliateAdvertiserDisclosure'
import React from 'react'
import Navbar from "@/components/common/Navbar";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import { Footer } from "@/components/common/Footer";
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
