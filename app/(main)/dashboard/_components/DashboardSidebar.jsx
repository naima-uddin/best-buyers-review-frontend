"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  LogOut,
  Menu,
  X,
  Notebook,
} from "lucide-react";

export default function DashboardSidebar({ userRole }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [clickedPath, setClickedPath] = useState(null);

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Products",
      icon: Package,
      path: "/dashboard/products",
    },
    {
      name: "Categories",
      icon: FolderTree,
      path: "/dashboard/categories",
    },
    {
      name: "Users",
      icon: Users,
      path: "/dashboard/users",
    },
    {
      name: "Blogs",
      icon: Notebook,
      path: "/dashboard/blog",
    },
  ];

  const isActive = (path) => {
    const currentPath = clickedPath || pathname || "";
    const normalizedPathname = currentPath.replace(/\/$/, "");
    const normalizedPath = path.replace(/\/$/, "");

    if (normalizedPath === "/dashboard") {
      return normalizedPathname === normalizedPath;
    }
    return normalizedPathname.startsWith(normalizedPath);
  };

  const handleNavClick = (path) => {
    setClickedPath(path);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    if (clickedPath && pathname === clickedPath) {
      setClickedPath(null);
    }
  }, [pathname, clickedPath]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-sm transition-transform duration-300 z-40 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-blue-600">Best Buyers View</h1>
            <p className="text-sm text-gray-500 mt-1">Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              if (userRole !== "admin" && index === 3) return null;

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3 px-4 py-2 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">Logged in as</p>
              <p className="text-sm font-medium text-gray-900 capitalize">
                {userRole}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
        />
      )}
    </>
  );
}
