"use client";
import { useEffect, useState, Suspense, useRef, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import ProductPageSidebar from "./ProductPageSidebar";
import Link from "next/link";
import { useCompare } from "@/context/CompareContext";
import CompareBox from "@/components/CompareBox";
import CompareModal from "@/components/CompareModal";
import CouponPopup from "./CouponPopup";
import BackButton from "@/ui/BackButton";
import Navbar from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";
import Breadcrumbs from "@/ui/Breadcrumbs";
import ProductListSkeleton from "@/components/skeletons/ProductListSkeleton";
import { slugify, unslugify, createProductSlug } from "@/lib/slugify";
import { Home, HomeIcon } from "lucide-react";
import { useCategories } from "@/context/CategoryContext";

// Helper function to generate correct product URL based on category hierarchy
const getProductUrl = (product) => {
  const mainSlug = slugify(product.mainCategory?.name || "");
  const subSlug = slugify(product.subCategory?.name || "");
  // Generate slug from title + ID for unique identification
  const productSlug = createProductSlug(product.title, product._id);

  if (product.subSubCategory?.name) {
    // Product with sub-sub-category: /category/main/sub/subsub/product-title-id
    const subSubSlug = slugify(product.subSubCategory.name);
    return `/category/${mainSlug}/${subSlug}/${subSubSlug}/${productSlug}`;
  } else {
    // Product without sub-sub-category: /category/main/sub/product-title-id
    return `/category/${mainSlug}/${subSlug}/${productSlug}`;
  }
};

function ProductByCategoryContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categories } = useCategories();
  const productSectionRef = useRef(null);

  // Decode URL params
  const mainCategoryName = params?.mainCategory
    ? unslugify(params.mainCategory)
    : null;
  const subCategoryName = params?.subCategory
    ? unslugify(params.subCategory)
    : null;
  const pageParam = parseInt(searchParams?.get("page")) || 1;
  const allParams = Object.fromEntries(searchParams?.entries() || []);
  const subSubCategoryParam = Object.keys(allParams).find(
    (key) => key !== "page" && key !== "sort"
  );

  console.log("🔍 ProductByCategory - Raw params:", params);
  console.log("🔍 ProductByCategory - mainCategoryName:", mainCategoryName);
  console.log("🔍 ProductByCategory - subCategoryName:", subCategoryName);
  console.log(
    "🔍 ProductByCategory - subSubCategoryParam:",
    subSubCategoryParam
  );

  // Compute date values once to avoid hydration mismatch
  const currentMonth = useMemo(
    () => new Date().toLocaleString("default", { month: "long" }),
    []
  );
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeProductImages, setActiveProductImages] = useState({});

  const sortParam = searchParams.get("sort") || "default";

  const { compareItems, addToCompare } = useCompare();

  // Move getLabelColor outside render for performance
  const getLabelColor = useMemo(
    () => (labelText) => {
      const lowerLabel = labelText.toLowerCase();

      if (
        lowerLabel.includes("amazon") ||
        lowerLabel.includes("amazon's choice")
      ) {
        return "bg-gradient-to-r from-black to-gray-600 text-white";
      } else if (
        lowerLabel.includes("best seller") ||
        lowerLabel.includes("bestseller")
      ) {
        return "bg-gradient-to-r from-orange-600 to-orange-500 text-white";
      } else if (lowerLabel.includes("trending")) {
        return "bg-gradient-to-r from-purple-700 to-purple-500 text-white";
      } else if (lowerLabel.includes("new") || lowerLabel.includes("arrival")) {
        return "bg-gradient-to-r from-green-700 to-green-500 text-white";
      } else if (lowerLabel.includes("featured")) {
        return "bg-gradient-to-r from-cyan-700 to-cyan-500 text-white";
      } else if (lowerLabel.includes("hot")) {
        return "bg-gradient-to-r from-red-700 to-red-500 text-white";
      } else if (lowerLabel.includes("popular")) {
        return "bg-gradient-to-r from-pink-700 to-pink-500 text-white";
      } else if (
        lowerLabel.includes("top pick") ||
        lowerLabel.includes("top-pick")
      ) {
        return "bg-gradient-to-r from-indigo-700 to-indigo-500 text-white";
      } else if (
        lowerLabel.includes("best value") ||
        lowerLabel.includes("best-value")
      ) {
        return "bg-gradient-to-r from-teal-700 to-teal-500 text-white";
      } else if (
        lowerLabel.includes("editor") ||
        lowerLabel.includes("editor-choice")
      ) {
        return "bg-gradient-to-r from-blue-700 to-blue-600 text-white";
      } else if (
        lowerLabel.includes("black friday") ||
        lowerLabel.includes("black-friday")
      ) {
        return "bg-gradient-to-r from-pink-800 to-pink-700 text-white";
      } else if (
        lowerLabel.includes("flash sale") ||
        lowerLabel.includes("flash-sale")
      ) {
        return "bg-gradient-to-r from-red-700 to-red-600 text-white";
      } else if (
        lowerLabel.includes("limited") ||
        lowerLabel.includes("limited-time")
      ) {
        return "bg-gradient-to-r from-yellow-700 to-yellow-500 text-white";
      } else if (lowerLabel.includes("deal") || lowerLabel.includes("sale")) {
        return "bg-gradient-to-r from-green-700 to-green-600 text-white";
      } else {
        return "bg-gradient-to-r from-gray-700 to-gray-500 text-white";
      }
    },
    []
  );

  const [showCoupon, setShowCoupon] = useState(false);
  const [couponProduct, setCouponProduct] = useState(null);
  const [couponQueue, setCouponQueue] = useState([]);
  const [couponIndex, setCouponIndex] = useState(0);
  const timerRef = useRef(null);

  const findExactSubSubCategoryName = (slugifiedName) => {
    if (!categories || !mainCategoryName || !subCategoryName) return null;

    // Find main category
    const mainCat = categories.find((cat) => cat.name === mainCategoryName);
    if (!mainCat) return null;

    // Find sub category
    const subCat = mainCat.children?.find(
      (sub) => sub.name === subCategoryName
    );
    if (!subCat) return null;

    // Find sub-sub category by comparing slugified names
    const subSubCat = subCat.children?.find(
      (subSub) => slugify(subSub.name) === slugifiedName
    );

    return subSubCat ? subSubCat.name : null;
  };

  useEffect(() => {
    if (!mainCategoryName || !subCategoryName) {
      setLoading(false);
      return;
    }

    async function fetchProducts() {
      try {
        setLoading(true);
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          "https://api.bestbuyersview.com/api";

        // Build URL with optional subSubCategoryName
        let url = `${apiUrl}/products?mainCategoryName=${encodeURIComponent(
          mainCategoryName
        )}&subCategoryName=${encodeURIComponent(
          subCategoryName
        )}&page=${pageParam}&limit=10&sort=${sortParam}`;

        // Add subSubCategoryName if provided
        let exactSubSubCategoryName = null;
        if (subSubCategoryParam) {
          // Find the exact sub-subcategory name from your categories data
          exactSubSubCategoryName =
            findExactSubSubCategoryName(subSubCategoryParam);
          if (exactSubSubCategoryName) {
            url += `&subSubCategoryName=${encodeURIComponent(
              exactSubSubCategoryName
            )}`;
            console.log("✅ Using sub-sub-category:", exactSubSubCategoryName);
          } else {
            console.log(
              "⚠️ Sub-sub-category param exists but not found in categories:",
              subSubCategoryParam
            );
          }
        }

        console.log("🔄 Fetching products from:", url);
        console.log("📦 Main Category:", mainCategoryName);
        console.log("📦 Sub Category:", subCategoryName);
        console.log("📦 Sub-Sub Category:", exactSubSubCategoryName || "None");
        console.log("📦 Page:", pageParam);
        console.log("📦 Sort:", sortParam);

        const res = await fetch(url);
        const data = await res.json();
        console.log("API Response:", data);

        if (data.success && data.data) {
          setProducts(data.data.products || []);
          setTotalPages(data.data.pagination?.pages || 1);

          const initialImages = {};
          data.data.products.forEach((product) => {
            const mainImage =
              product.images?.find((img) => img.variant === "MAIN")?.url ||
              product.images?.[0]?.url;
            initialImages[product._id] = mainImage;
          });
          setActiveProductImages(initialImages);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [
    mainCategoryName,
    subCategoryName,
    pageParam,
    sortParam,
    subSubCategoryParam,
  ]);

  // Update page change handler to preserve subSubCategory
  const handlePageChange = (newPage) => {
    console.log("📄 Changing to page:", newPage);
    console.log("📄 Current subSubCategory:", subSubCategoryParam);
    console.log("📄 Current sort:", sortParam);

    // Build query string manually to avoid "=" for sub-subcategory
    let queryString = "";

    if (subSubCategoryParam) {
      queryString += `${subSubCategoryParam}`;
    }

    if (sortParam && sortParam !== "default") {
      queryString += `${queryString ? "&" : ""}sort=${sortParam}`;
    }

    // Always add page parameter
    queryString += `${queryString ? "&" : ""}page=${newPage}`;

    const fullUrl = `/category/${slugify(mainCategoryName)}/${slugify(
      subCategoryName
    )}${queryString ? "?" + queryString : ""}`;
    console.log("📄 Navigating to:", fullUrl);

    router.push(fullUrl, { scroll: false });

    // Smooth scroll to product section after navigation
    setTimeout(() => {
      scrollToProductSection();
    }, 100);
  };

  // Function to scroll to product section smoothly
  const scrollToProductSection = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const getStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center text-yellow-500 text-base sm:text-lg">
        {"★".repeat(fullStars)}
        {hasHalfStar && "★"}
        {"☆".repeat(emptyStars)}
      </div>
    );
  };

  const handleThumbnailHover = (productId, imageUrl) => {
    setActiveProductImages((prev) => ({
      ...prev,
      [productId]: imageUrl,
    }));
  };

  const truncateFeature = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const truncateTitle = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleCompareCheckbox = (product, isChecked) => {
    if (isChecked) addToCompare(product);
  };

  useEffect(() => {
    if (!products || products.length === 0) return;
    const coupons = products.filter((p) => p.isCoupon);
    setCouponQueue(coupons);
    setCouponIndex(0);
  }, [products, subCategoryName]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (couponQueue.length === 0) return;

    timerRef.current = setTimeout(() => {
      setCouponProduct(couponQueue[0]);
      setShowCoupon(true);
      setCouponIndex(0);
    }, 6000);

    return () => clearTimeout(timerRef.current);
  }, [couponQueue, subCategoryName]);

  const handleCloseCoupon = () => {
    setShowCoupon(false);
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setCouponIndex((prev) => {
        const nextIndex = (prev + 1) % couponQueue.length;
        setCouponProduct(couponQueue[nextIndex]);
        setShowCoupon(true);
        return nextIndex;
      });
    }, 40000);
  };

  // Update sort handler to preserve subSubCategory
  const handleSortChange = (e) => {
    const newSort = e.target.value;
    const queryParams = new URLSearchParams();
    queryParams.set("page", pageParam);
    queryParams.set("sort", newSort);

    // Preserve the sub-subcategory if it exists
    if (subSubCategoryParam) {
      queryParams.set(subSubCategoryParam, ""); // Key with empty value
    }

    router.push(
      `/category/${slugify(mainCategoryName)}/${slugify(
        subCategoryName
      )}?${queryParams.toString()}`
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4">
          <Breadcrumbs mainName={mainCategoryName} subName={subCategoryName} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 md:py-10">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <BackButton className="-mb-2" />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Best {subCategoryName} ({mainCategoryName})
            </h1>
            <h2 className="text-xs sm:text-sm md:text-base px-4 sm:px-8 md:px-16 lg:px-40 text-gray-700 mb-2 leading-relaxed">
              Home, Food, Fashion, Beauty, Baby, Electronics, Sports, Health,
              Automotive, Pets and so many more. Explore our expertly curated
              collection designed to fit your lifestyle, budget, and every need
            </h2>
            <p
              className="text-xs sm:text-sm md:text-base text-gray-600"
              suppressHydrationWarning
            >
              Updated {currentMonth} {currentYear} • Top-rated {subCategoryName}{" "}
              selected by experts.
            </p>
          </div>

          {/* Sorting Skeleton */}
          <div className="flex justify-between items-center mb-4 md:mb-6 px-2 sm:px-0">
            <div className="flex items-center gap-2">
              <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Mobile Related Sidebar */}
          <div className="block lg:hidden mb-6">
            <div className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white">
              <h3 className="text-lg font-semibold mb-3">Related Categories</h3>
              <ProductPageSidebar
                mainCategoryName={mainCategoryName}
                currentSubCategoryName={subCategoryName}
                findExactSubSubCategoryName={findExactSubSubCategoryName}
                showOnlyRelatedCategories={true}
                onCategoryChange={scrollToProductSection}
              />
            </div>
          </div>

          {/* Layout with Skeleton */}
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
            <div className="flex-1">
              <ProductListSkeleton />
            </div>
            <div className="w-full lg:w-80 lg:sticky lg:top-24 lg:self-start">
              <ProductPageSidebar
                mainCategoryName={mainCategoryName}
                findExactSubSubCategoryName={findExactSubSubCategoryName}
                currentSubCategoryName={subCategoryName}
              />
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
  }

  // ⬇️ ⬇️ FIND TOP PRODUCT (Based on review count)
  const topProduct =
    products.length > 0
      ? [...products].sort(
          (a, b) =>
            (b.customRating?.reviewCount || 0) -
            (a.customRating?.reviewCount || 0)
        )[0]
      : null;
  const displayTitle = subSubCategoryParam
    ? `Best ${
        findExactSubSubCategoryName(subSubCategoryParam) ||
        unslugify(subSubCategoryParam)
      }`
    : `Best ${subCategoryName}`;
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4">
        <nav
          className="flex items-center text-sm text-gray-600 space-x-1 py-3"
          aria-label="Breadcrumb"
        >
          {/* Home */}
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 flex items-center"
            aria-label="Home"
          >
            <Home size={16} />
          </Link>

          {mainCategoryName && (
            <>
              <span className="text-gray-400">/</span>

              {/* Main Category - Link to category page with smooth scroll */}
              <Link
                href={`/category?scrollTo=${slugify(mainCategoryName)}`}
                className="font-medium text-gray-800 hover:text-blue-700 hover:underline"
              >
                {mainCategoryName}
              </Link>
            </>
          )}

          {subCategoryName && (
            <>
              <span className="text-gray-400">/</span>

              {/* Sub Category - Current page (no link) */}
              <span
                className="text-gray-600 font-semibold truncate max-w-[150px] md:max-w-[200px]"
                aria-current="page"
              >
                {subCategoryName}
              </span>
            </>
          )}

          {/* Optional: Sub-Sub Category */}
          {subSubCategoryParam && (
            <>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600 font-semibold truncate max-w-[150px] md:max-w-[200px]">
                {unslugify(subSubCategoryParam)}
              </span>
            </>
          )}
        </nav>

        {/* JSON-LD Structured Data for Breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://bestbuyersview.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: mainCategoryName,
                  item: `https://bestbuyersview.com/category?scrollTo=${slugify(
                    mainCategoryName
                  )}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: subCategoryName,
                  item: `https://bestbuyersview.com/category/${slugify(
                    mainCategoryName
                  )}/${slugify(subCategoryName)}`,
                },
                ...(subSubCategoryParam
                  ? [
                      {
                        "@type": "ListItem",
                        position: 4,
                        name: unslugify(subSubCategoryParam),
                        item: `https://bestbuyersview.com/category/${slugify(
                          mainCategoryName
                        )}/${slugify(subCategoryName)}?${subSubCategoryParam}`,
                      },
                    ]
                  : []),
              ],
            }),
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-10">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <BackButton className="-mb-2" />
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {displayTitle}
          </h1>
          <h2 className="text-xs sm:text-sm md:text-base px-4 sm:px-8 md:px-16 lg:px-40 text-gray-700 mb-2 leading-relaxed">
            Home, Food, Fashion, Beauty, Baby, Electronics, Sports, Health,
            Automotive, Pets and so many more. Explore our expertly curated
            collection designed to fit your lifestyle, budget, and every need
          </h2>
          <p
            className="text-xs sm:text-sm md:text-base text-gray-600"
            suppressHydrationWarning
          >
            Updated {currentMonth} {currentYear} • Top-rated {subCategoryName}{" "}
            selected by experts.
          </p>
        </div>

        {/* Sorting */}
        <div className="flex justify-between items-center mb-8 md:mb-10 px-2 sm:px-0 relative z-10">
          <div className="flex items-center gap-2 relative">
            <span className="text-xs sm:text-sm text-gray-600 hidden sm:inline">
              Sort by:
            </span>
            <select
              value={sortParam}
              onChange={handleSortChange}
              className="border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-xs sm:text-sm bg-white hover:border-blue-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer relative z-20"
            >
              <option value="rating">Ratings (High to Low)</option>
              <option value="reviews">Reviews Count (High to Low)</option>
              <option value="popularity">Popularity</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
          <div className="text-xs sm:text-sm text-gray-600">
            {products.length} Products
          </div>
        </div>

        {/* Mobile Related Sidebar */}
        <div className="block lg:hidden mb-6">
          <div className="border border-gray-200 rounded-xl shadow-sm p-4 bg-white">
            <h3 className="text-lg font-semibold mb-3">Related Categories</h3>
            <ProductPageSidebar
              mainCategoryName={mainCategoryName}
              currentSubCategoryName={subCategoryName}
              showOnlyRelatedCategories={true}
              onCategoryChange={scrollToProductSection}
            />
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-8">
          {/* Product List */}
          <div className="flex-1 space-y-6 md:space-y-8">
            {/* Product Section Ref - scroll target with offset for fixed header */}
            <div ref={productSectionRef} className="-mt-20 pt-20"></div>

            {products.length > 0 ? (
              <>
                {products.map((product, index) => {
                  const mainImage =
                    product.images?.find((img) => img.variant === "MAIN")
                      ?.url || product.images?.[0]?.url;
                  const thumbImages =
                    product.images?.filter((img) => img.variant === "SUB") ||
                    product.images?.slice(1, 5) ||
                    [];
                  const currentImage =
                    activeProductImages[product._id] || mainImage;
                  const productNumber = (pageParam - 1) * 10 + index + 1;

                  return (
                    <div key={product._id} className="relative">
                      {/* Product Number */}
                      <div className="absolute left-4 top-4 sm:-left-2 sm:left-0 md:left-4 sm:top-1/2 z-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white md:w-8 md:h-8 w-6 h-6 md:rounded-full flex items-center justify-center font-bold text-xs sm:text-sm md:text-base sm:transform sm:-translate-y-1/2 shadow-lg">
                        {productNumber}
                      </div>

                      {/* Labels Section - Flex row for all devices */}
                      {product.labels && product.labels.length > 0 && (
                        <div className="absolute -top-3 md:-top-5 left-4 md:ml-8 md:left-0 right-4 z-10 flex flex-row justify-start">
                          {product.labels.map((label, i) => {
                            const totalLabels = product.labels.length;
                            const isFirst = i === 0;
                            const arrowSize = 10;

                            return (
                              <span
                                key={i}
                                className={`
                                  relative px-3 mt-1 md:mt-2 md:px-4 py-0.5 md:py-1 text-[8px] md:text-[10px] font-bold uppercase text-white shadow-lg whitespace-nowrap
                                  ${getLabelColor(label)}
                                `}
                                style={{
                                  clipPath: isFirst
                                    ? `polygon(0 0, calc(100% - ${arrowSize}px) 0, 100% 50%, calc(100% - ${arrowSize}px) 100%, 0 100%)`
                                    : `polygon(0 0, calc(100% - ${arrowSize}px) 0, 100% 50%, calc(100% - ${arrowSize}px) 100%, 0 100%, ${arrowSize}px 50%)`,
                                  zIndex: totalLabels - i,
                                  marginLeft: !isFirst
                                    ? `-${arrowSize}px`
                                    : "0",
                                }}
                              >
                                {label}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      {/* Product Card */}
                      <div className="bg-white shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-400 ml-4 md:ml-8 relative">
                        <div className="p-3 sm:p-4 md:p-6">
                          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                            {/* Image Block */}
                            <div className="flex flex-col items-center w-full md:w-40 lg:w-48 relative mx-auto md:mx-0">
                              <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-40 md:h-40 lg:w-48 lg:h-48 mb-1 md:mb-2 mt-2 sm:mt-6">
                                <Image
                                  src={currentImage || "/placeholder-image.jpg"}
                                  alt={product.title}
                                  fill
                                  className="object-contain rounded-lg"
                                />
                              </div>

                              {thumbImages.length > 0 && (
                                <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
                                  {thumbImages.slice(0, 4).map((thumb, i) => (
                                    <div
                                      key={i}
                                      className="relative w-8 h-8 sm:w-10 sm:h-10 border-2 border-gray-300 rounded cursor-pointer hover:border-blue-500 transition-all hover:scale-110"
                                      onMouseEnter={() =>
                                        handleThumbnailHover(
                                          product._id,
                                          thumb.url
                                        )
                                      }
                                    >
                                      <Image
                                        src={thumb.url}
                                        alt={`${product.title} 
                                        thumbnail ${i + 1}`}
                                        fill
                                        className="object-cover rounded"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Info Block */}
                            <div className="flex-1 ">
                              <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                <div className="flex items-center">
                                  {getStarRating(
                                    product.customRating?.rating || 4.5
                                  )}
                                </div>
                                <span className="text-gray-700 font-bold text-base sm:text-lg">
                                  {product.customRating?.rating?.toFixed(1) ||
                                    "4.5"}
                                </span>
                                <span className="text-gray-600 text-xs sm:text-sm">
                                  ({product.customRating?.reviewCount || 29}{" "}
                                  reviews)
                                </span>
                              </div>

                              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 leading-tight text-gray-900">
                                {truncateTitle(product.title, 47)}
                              </h2>

                              <div className="space-y-1.5 sm:space-y-1 mb-3 sm:mb-4">
                                {product.specifications &&
                                product.specifications.length > 0 ? (
                                  product.specifications
                                    .slice(0, 5)
                                    .map((spec, i) => (
                                      <div
                                        key={i}
                                        className="flex items-start gap-2"
                                      >
                                        <div className="w-1.5 h-1.5 mt-2 rounded-full bg-gray-400 "></div>
                                        <span className="text-gray-700 text-xs sm:text-sm leading-relaxed tracking-[0.2px]">
                                          <span className="font-bold">
                                            {spec.key}:
                                          </span>{" "}
                                          {truncateFeature(spec.value, 40)}
                                        </span>
                                      </div>
                                    ))
                                ) : product.features?.feature &&
                                  product.features.feature.length > 0 ? (
                                  product.features.feature
                                    .slice(0, 4)
                                    .map((feature, i) => (
                                      <div
                                        key={i}
                                        className="flex items-start gap-2"
                                      >
                                        <div className="w-1.5 h-1.5 mt-1 rounded-full bg-gray-400"></div>
                                        <span className="text-gray-700 text-xs sm:text-sm leading-relaxed tracking-[0.2px]">
                                          {truncateFeature(feature, 45)}
                                        </span>
                                      </div>
                                    ))
                                ) : (
                                  <>
                                    <div className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 mt-1 rounded-full bg-gray-400"></div>
                                      <span className="text-gray-700 text-xs sm:text-sm leading-relaxed tracking-[0.2px]">
                                        16-inch carbon steel frame ideal for
                                        teens and adults under 5'2"
                                      </span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <div className="w-1.5 h-1.5 mt-1 rounded-full bg-gray-400"></div>
                                      <span className="text-gray-700 text-xs sm:text-sm leading-relaxed tracking-[0.2px]">
                                        Dual suspension with 4 shock absorbers
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>

                              {product?.isFullReview && (
                                <Link
                                  href={getProductUrl(product)}
                                  className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium mt-0 inline-flex items-center gap-1 hover:gap-2 transition-all"
                                >
                                  Read Full Details Specification <span>→</span>
                                </Link>
                              )}
                            </div>

                            {/* Price Block */}
                            <div className="flex flex-col items-center md:items-end justify-between w-full md:w-44 lg:w-48 mt-3 md:mt-0 border-t md:border-t-0 pt-3 md:pt-0">
                              <div className="text-center md:text-right w-full">
                                <div className="text-lg sm:text-xl md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb text-center">
                                  Save {product.discount?.percentage || 36}%
                                </div>

                                <a
                                  href={product.affiliateUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105 text-center text-base sm:text-lg md:text-xl mt-2"
                                >
                                  Check Price
                                </a>

                                <div className="flex flex-col items-center my-3 sm:my-4">
                                  <Image
                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                                    alt="Amazon"
                                    width={44}
                                    height={24}
                                    className="h-5 sm:h-6 mb-1"
                                  />
                                  <span className="text-xs text-gray-500">
                                    Prime Delivery
                                  </span>
                                </div>

                                <div className="hidden md:block">
                                  <div className="flex items-center justify-center mt-4 sm:mt-6">
                                    <input
                                      type="checkbox"
                                      id={`compare-${product._id}`}
                                      className="w-3 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                      onChange={(e) =>
                                        handleCompareCheckbox(
                                          product,
                                          e.target.checked
                                        )
                                      }
                                      checked={compareItems.some(
                                        (item) => item._id === product._id
                                      )}
                                    />
                                    <label
                                      htmlFor={`compare-${product._id}`}
                                      className="ml-2 text-xs sm:text-sm text-gray-700 font-medium cursor-pointer"
                                    >
                                      Compare
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Pagination */}
                <div className="flex justify-center items-center mt-6 md:mt-10 gap-1 sm:gap-2 flex-wrap">
                  <button
                    onClick={() => handlePageChange(pageParam - 1)}
                    disabled={pageParam === 1}
                    className={`px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base font-medium transition-all ${
                      pageParam === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-blue-50 hover:border-blue-500 text-gray-700"
                    }`}
                  >
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base font-medium transition-all ${
                        pageParam === i + 1
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-md"
                          : "bg-white hover:bg-blue-50 hover:border-blue-500 text-gray-700"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(pageParam + 1)}
                    disabled={pageParam === totalPages}
                    className={`px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base font-medium transition-all ${
                      pageParam === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white hover:bg-blue-50 hover:border-blue-500 text-gray-700"
                    }`}
                  >
                    Next
                  </button>
                </div>

                {/* ⭐ TOP PRODUCT SECTION STARTS HERE ⭐ */}
                {topProduct && (
                  <div className="relative mt-10 mb-6 max-w-4xl mx-auto">
                    {/* Ribbon */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 text-xs sm:text-sm font-bold rounded-full shadow-lg flex items-center gap-1 z-20">
                      🔥 OUR TOP CHOICE
                    </div>

                    {/* Outer Premium Glow */}
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-[2px] rounded-2xl shadow-xl hover:scale-[1.01] transition-all duration-300">
                      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-inner">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          {/* Product Image */}
                          <div className="relative w-44 h-44 sm:w-48 sm:h-48">
                            <Image
                              src={
                                activeProductImages[topProduct._id] ||
                                topProduct.images?.[0]?.url
                              }
                              alt={topProduct.title}
                              fill
                              className="object-contain rounded-xl"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-yellow-500 text-lg sm:text-xl">
                                ⭐
                              </span>
                              <span className="font-bold text-lg sm:text-xl">
                                {topProduct.customRating?.rating?.toFixed(1) ||
                                  "4.5"}
                              </span>
                              <span className="text-gray-600 text-xs sm:text-sm">
                                ({topProduct.customRating?.reviewCount || 29}{" "}
                                reviews)
                              </span>
                            </div>

                            <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-3">
                              {truncateTitle(topProduct.title, 60)}
                            </h2>

                            <ul className="space-y-1.5 mb-4 text-gray-700 text-xs sm:text-sm">
                              {topProduct.specifications
                                ?.slice(0, 4)
                                ?.map((spec, i) => (
                                  <li
                                    key={i}
                                    className="flex gap-2 items-start"
                                  >
                                    <span className="text-yellow-500 mt-0.5">
                                      •
                                    </span>
                                    <span>
                                      <span className="font-bold">
                                        {spec.key}:
                                      </span>{" "}
                                      {truncateFeature(spec.value, 60)}
                                    </span>
                                  </li>
                                )) ??
                                topProduct.features?.feature
                                  ?.slice(0, 4)
                                  ?.map((f, i) => (
                                    <li
                                      key={i}
                                      className="flex gap-2 items-start"
                                    >
                                      <span className="text-yellow-500 mt-0.5">
                                        •
                                      </span>
                                      {truncateFeature(f, 60)}
                                    </li>
                                  ))}
                            </ul>
                            {topProduct?.isFullReview && (
                              <Link
                                href={getProductUrl(topProduct)}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                              >
                                Read Full Specification →
                              </Link>
                            )}
                          </div>

                          {/* CTA Section */}
                          <div className="text-center w-full md:w-48">
                            <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent drop-shadow-md mb-2">
                              Save {topProduct.discount?.percentage || 36}%
                            </div>

                            <a
                              href={topProduct.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold py-2.5 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                            >
                              👉 Check Latest Price
                            </a>

                            <Image
                              src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
                              alt="Amazon"
                              width={44}
                              height={24}
                              className="h-6 mt-2 mx-auto opacity-80"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* ⭐ TOP PRODUCT SECTION END ⭐ */}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">
                    No Products Found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    We couldn't find any products in this category.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Browse Other Categories
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 lg:sticky lg:top-24 lg:self-start">
            <ProductPageSidebar
              mainCategoryName={mainCategoryName}
              currentSubCategoryName={subCategoryName}
              onCategoryChange={scrollToProductSection}
            />
          </div>
        </div>

        <div className="hidden md:block">
          <CompareBox />
          <CompareModal />
        </div>

        <CouponPopup
          show={showCoupon}
          onClose={handleCloseCoupon}
          couponProduct={couponProduct}
        />
      </div>

      <Footer />
    </>
  );
}

export default function ProductByCategory() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen text-gray-500">
          Loading...
        </div>
      }
    >
      <ProductByCategoryContent />
    </Suspense>
  );
}
