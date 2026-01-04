import Navbar from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section Skeleton */}
        <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="h-12 sm:h-16 w-48 bg-white/20 rounded-lg mx-auto mb-6 animate-pulse" />
            <div className="h-6 w-96 max-w-full bg-white/10 rounded mx-auto mb-8 animate-pulse" />
            <div className="max-w-xl mx-auto">
              <div className="h-12 bg-white/10 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Category Filter Skeleton */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 w-20 bg-gray-200 rounded-full animate-pulse" />
            ))}
          </div>

          {/* Featured Blog Skeleton */}
          <div className="h-[400px] sm:h-[500px] bg-gray-200 rounded-2xl animate-pulse mb-10" />

          {/* Blog Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-5">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded mb-4" />
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
