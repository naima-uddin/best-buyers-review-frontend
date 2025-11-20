export default function ProductListSkeleton() {
  return (
    <div className="space-y-4 md:space-y-6 animate-pulse">
      {[1, 2, 3, 4, 5].map((index) => (
        <div key={index} className="relative">
          {/* Product Number Skeleton */}
          <div className="absolute -left-2 sm:left-0 md:left-4 top-6 sm:top-1/2 z-10 bg-gray-300 w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full transform sm:-translate-y-1/2"></div>

          {/* Product Card Skeleton */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 ml-6 sm:ml-8 md:ml-10">
            <div className="p-3 sm:p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Image Block Skeleton */}
                <div className="flex flex-col items-center w-full md:w-40 lg:w-48 relative mx-auto md:mx-0">
                  {/* Main Image */}
                  <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-1 md:mb-2 bg-gray-200 rounded-lg"></div>

                  {/* Thumbnail Images */}
                  <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded"
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Info Block Skeleton */}
                <div className="flex-1">
                  {/* Rating */}
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                    <div className="h-6 w-24 bg-gray-200 rounded"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  </div>

                  {/* Title */}
                  <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2 sm:mb-3 w-1/2"></div>

                  {/* Features */}
                  <div className="space-y-1.5 sm:space-y-1 mb-3 sm:mb-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 mt-1 rounded-full bg-gray-300"></div>
                        <div className="h-4 bg-gray-200 rounded flex-1"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Block Skeleton */}
                <div className="flex flex-col items-center md:items-end justify-between w-full md:w-44 lg:w-48 mt-3 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-center md:text-right w-full">
                    {/* Discount */}
                    <div className="h-6 bg-gray-200 rounded mb-2 w-24 mx-auto md:mx-0 md:ml-auto"></div>

                    {/* Button */}
                    <div className="h-12 bg-gray-200 rounded-lg w-full mt-2"></div>

                    {/* Amazon Logo */}
                    <div className="flex flex-col items-center my-3 sm:my-4">
                      <div className="h-6 w-16 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>

                    {/* Compare Checkbox */}
                    <div className="hidden md:flex items-center justify-center mt-4 sm:mt-6">
                      <div className="w-3 h-3 bg-gray-200 rounded"></div>
                      <div className="ml-2 h-4 w-16 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
