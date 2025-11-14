"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/Card";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function DashboardHomePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    totalCategories: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch products count
        const productsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?page=1&limit=1`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const productsData = await productsRes.json();

        // Fetch categories count
        const categoriesRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const categoriesData = await categoriesRes.json();

        setStats({
          totalProducts: productsData.data?.pagination?.total || 0,
          featuredProducts:
            productsData.data?.products?.filter((p) => p.isFeatured)?.length ||
            0,
          totalCategories: categoriesData?.length || 0,
          activeUsers: 1, // Placeholder
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "blue",
      link: "/dashboard/products",
    },
    {
      title: "Featured Products",
      value: stats.featuredProducts,
      icon: TrendingUp,
      color: "green",
      link: "/dashboard/products",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: ShoppingCart,
      color: "purple",
      link: "/dashboard/categories",
    },
    {
      title: "Active Users",
      value: stats.activeUsers,
      icon: Users,
      color: "orange",
      link: "/dashboard/users",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's an overview of your store.
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.title}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(stat.link)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`p-3 rounded-lg ${colorClasses[stat.color]}`}
                      >
                        <Icon size={24} />
                      </div>
                      <ArrowRight className="text-gray-400" size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </h3>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent
                className="p-6"
                onClick={() => router.push("/dashboard/products/create")}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                    <Package size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Add New Product
                    </h3>
                    <p className="text-sm text-gray-500">
                      Create a new product listing
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent
                className="p-6"
                onClick={() => router.push("/dashboard/products")}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                    <ShoppingCart size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Manage Products
                    </h3>
                    <p className="text-sm text-gray-500">
                      View and edit all products
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent
                className="p-6"
                onClick={() => router.push("/dashboard/categories")}
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Manage Categories
                    </h3>
                    <p className="text-sm text-gray-500">
                      Organize product categories
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
