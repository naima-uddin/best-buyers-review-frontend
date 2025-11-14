"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Go Back", className = "" }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // fallback
    }
  };

  return (
    <button
      onClick={handleBack}
      className={`text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-all ${className}`}
    >
      <ArrowLeft className="w-3 h-3" />
      {label}
    </button>
  );
}
