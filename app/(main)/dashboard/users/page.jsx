"use client";
import UserManagement from "@/page-components/DashboardPage/UserManagement";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function UsersPage() {
  return (
    <>
      <UserManagement />
    </>
  );
}
