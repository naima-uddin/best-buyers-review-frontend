"use client";
import CategoryPage from "@/page-components/CategoryPage/CategoryPage";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import React from "react";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <CategoryPage />
      <ScrollToTopButton />
    </>
  );
}
