"use client";
import React from "react";
import Login from "@/page-components/LoginPage/Login";
import ScrollToTopButton from "@/ui/ScrollToTopButton";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Note: metadata cannot be used with "use client", move to layout if needed

export default function Page() {
  return (
    <>
      <Login />
      <ScrollToTopButton />
    </>
  );
}
