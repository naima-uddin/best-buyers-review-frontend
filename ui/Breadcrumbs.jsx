"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!pathname) return null;

  const pathParts = pathname
    .split("/")
    .filter((x) => x !== "");

  const buildHref = (index) =>
    "/" + pathParts.slice(0, index + 1).join("/");

  return (
    <nav className="flex items-center text-sm text-gray-600 space-x-1 py-3">
      {/* Home icon */}
      <Link href="/" className="text-gray-700 hover:text-blue-600">
        <Home size={16} />
      </Link>

      {pathParts.length > 0 && <span>/</span>}

      {pathParts.map((part, index) => {
        const href = buildHref(index);

        const formatted = part
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        const isLast = index === pathParts.length - 1;

        return (
          <span key={href} className="flex items-center">
            {!isLast ? (
              <Link
                href={href}
                className="font-semibold text-gray-800 hover:text-blue-700"
              >
                {formatted}
              </Link>
            ) : (
              <span className="text-gray-500 font-medium truncate max-w-[200px]">
                {formatted}
              </span>
            )}

            {!isLast && <span className="mx-1">/</span>}
          </span>
        );
      })}
    </nav>
  );
}
