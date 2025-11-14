"use client";
import Dashboard from "@/page-components/DashboardPage/Dashboard";
import ScrollToTopButton from "@/ui/ScrollToTopButton";
import React from "react";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <Dashboard />
      <ScrollToTopButton />
    </>
  );
}
