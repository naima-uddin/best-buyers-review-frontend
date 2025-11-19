import CategoryPage from "@/page-components/CategoryPage/CategoryPage";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import React from "react";

// // Force dynamic rendering for this page
// export const dynamic = "force-dynamic";

export const metadata = {
  title: "Category",
  description: "Discover, Compare & Pick the Best from Baby,Beauty,Fashion,Fitness,Tech,Garden,Gifts,Home,Health,Money,Office,Outdoor,Pets,Sports,Tools,Food & more categories",
  twitter:{
    card: "summary_large_image",
    title: "Best Buyers View",
    description: "Discover, Compare & Pick the Best",
    site: "https://bestbuyersview.com"
  }
};

export default function Page() {
  return (
    <>
      <CategoryPage />
      <ScrollToTopButton />
    </>
  );
}
