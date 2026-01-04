import Navbar from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section Skeleton */}
        <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 text-white">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2 mb-6">
              <div className="h-4 w-12 bg-white/20 rounded animate-pulse" />
              <span>/</span>
              <div className="h-4 w-12 bg-white/20 rounded animate-pulse" />
              <span>/</span>
              <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
            </div>

            {/* Category Skeleton */}
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-white/20 rounded-full animate-pulse" />
              <div className="h-6 w-20 bg-white/20 rounded-full animate-pulse" />
            </div>

            {/* Title Skeleton */}
            <div className="h-10 sm:h-14 w-3/4 bg-white/20 rounded mb-6 animate-pulse" />

            {/* Meta Skeleton */}
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
              <div className="h-4 w-20 bg-white/20 rounded animate-pulse" />
              <div className="h-4 w-16 bg-white/20 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Content Skeleton */}
            <article className="flex-1 lg:max-w-3xl">
              {/* Featured Image Skeleton */}
              <div className="mb-10 -mt-20 relative z-10">
                <div className="w-full h-[300px] sm:h-[400px] bg-gray-200 rounded-2xl animate-pulse" />
              </div>

              {/* Excerpt Skeleton */}
              <div className="border-l-4 border-blue-600 pl-6 mb-8">
                <div className="h-6 w-full bg-gray-200 rounded mb-2 animate-pulse" />
                <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Content Blocks Skeleton */}
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    {i % 3 === 0 && (
                      <div className="h-8 w-1/2 bg-gray-200 rounded mb-4 animate-pulse" />
                    )}
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                      <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                      <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Sidebar Skeleton */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 w-full bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
