"use client";

import { useState } from "react";
import { UserRoleProvider } from "../context/UserRoleContext";
import DashboardSidebar from "./DashboardSidebar";
import AuthChecker from "./AuthChecker";

export default function DashboardClientWrapper({ children }) {
  const [userRole, setUserRole] = useState("moderator");

  return (
    <AuthChecker onRoleChange={setUserRole}>
      <UserRoleProvider value={{ userRole }}>
        <div className="min-h-screen bg-gray-50">
          <DashboardSidebar userRole={userRole} />
          <main className="lg:ml-64 min-h-screen">{children}</main>
        </div>
      </UserRoleProvider>
    </AuthChecker>
  );
}
