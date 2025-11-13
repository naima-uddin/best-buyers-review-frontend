"use client";
import UserManagement from "@/page-components/DashboardPage/UserManagement";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <UserManagement />
      </div>
    </div>
  );
}
