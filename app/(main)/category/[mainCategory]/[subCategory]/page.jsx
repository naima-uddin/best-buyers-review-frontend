"use client";
import ProductByCategory from "@/page-components/ProductPage/ProductByCategory";
import React from "react";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      <ProductByCategory />
    </>
  );
}
