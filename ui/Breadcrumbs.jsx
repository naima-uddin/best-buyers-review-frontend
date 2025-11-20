// components/seo/Breadcrumbs.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

export default function Breadcrumbs({
  mainName,
  subName,
  productName,
  blogTitle,
  categoryName,
  blogCategory,
}) {
  const pathname = usePathname();
  if (!pathname) return null;

  // create path parts once
  const pathParts = pathname.split("/").filter(Boolean);

  // build human readable name for each segment
  const nameFor = (part, index) => {
    // if last segment and overridden by props use that
    const isLast = index === pathParts.length - 1;
    if (isLast && blogTitle && part === pathParts[pathParts.length - 1] && pathname.includes("/blog/")) {
      return blogTitle;
    }
    if (isLast && productName) return productName;

    // main/sub/category overrides by position
    if (index === 1 && mainName) return mainName;
    if (index === 2 && subName) return subName;
    if (index === 1 && categoryName) return categoryName;
    if (part === "blog" && blogCategory) return blogCategory;

    const map = {
      blog: "Blog",
      category: "Categories",
      product: "Products",
      about: "About Us",
      contact: "Contact",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      AdvertiserDisclosure: "Advertiser Disclosure",
    };

    if (map[part]) return map[part];

    // default: prettify slug
    return part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Build items for JSON-LD
  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://bestbuyersview.com",
    },
  ];

  let currentPath = "";
  pathParts.forEach((part, i) => {
    currentPath += `/${part}`;
    breadcrumbItems.push({
      "@type": "ListItem",
      position: i + 2,
      name: nameFor(part, i),
      item: `https://bestbuyersview.com${currentPath}`,
    });
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems,
  };

  const buildHref = (index) => "/" + pathParts.slice(0, index + 1).join("/");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <nav className="flex items-center text-sm text-gray-600 space-x-1 py-3" aria-label="Breadcrumb">
        <Link href="/" className="text-gray-700 hover:text-blue-600 flex items-center" aria-label="Home">
          <Home size={16} />
        </Link>

        {pathParts.length > 0 && <span className="text-gray-400">/</span>}

        {pathParts.map((part, index) => {
          const href = buildHref(index);
          const formatted = nameFor(part, index);
          const isLast = index === pathParts.length - 1;
          return (
            <span key={href} className="flex items-center">
              {!isLast ? (
                <Link href={href} className="font-medium text-gray-800 hover:text-blue-700">
                  {formatted}
                </Link>
              ) : (
                <span className="text-gray-600 font-semibold truncate max-w-[200px] md:max-w-[300px]" aria-current="page">
                  {formatted}
                </span>
              )}
              {!isLast && <span className="mx-1 text-gray-400">/</span>}
            </span>
          );
        })}
      </nav>
    </>
  );
}
