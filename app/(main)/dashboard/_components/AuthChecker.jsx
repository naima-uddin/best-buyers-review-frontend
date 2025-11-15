"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthChecker({ children, onRoleChange }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.role || "admin";
      if (onRoleChange) {
        onRoleChange(role);
      }
    } catch (error) {
      console.error("Error parsing token:", error);
      router.push("/login");
    }
  }, [router, onRoleChange]);

  return <>{children}</>;
}
