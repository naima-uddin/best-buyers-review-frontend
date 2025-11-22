"use client";

import { useState, useRef, useEffect } from "react";
import { useCategories } from "@/context/CategoryContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { slugify } from "@/lib/slugify";

// Icons
import { Menu, X, Search } from "lucide-react";
import Button from "@/ui/Button";

export default function Navbar() {
  const router = useRouter();
  const { categories } = useCategories();

  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const mobileSearchRef = useRef(null);

  // -----------------------------------------------------
  // 🔥 Flatten Only Subcategories
  // -----------------------------------------------------
  const flattenSubCategories = () => {
    if (!categories) return [];
    let subs = [];

    categories.forEach((main) => {
      if (main.children && main.children.length > 0) {
        main.children.forEach((sub) =>
          subs.push({
            mainName: main.name,
            subName: sub.name,
            mainId: main._id,
            subId: sub._id,
          })
        );
      }
    });

    return subs;
  };

  // -----------------------------------------------------
  // 🔥 Handle Search Typing (Desktop & Mobile)
  // -----------------------------------------------------
  const handleSearch = (text) => {
    setQuery(text);
    setSearchQuery(text);

    const allSubs = flattenSubCategories();
    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    const filtered = allSubs.filter((item) =>
      item.subName.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(filtered.slice(0, 8)); // limit to 8
  };

  // -----------------------------------------------------
  // 🔥 Handle Click on Suggestion
  // -----------------------------------------------------
  const handleSuggestionClick = (item) => {
    setQuery("");
    setSearchQuery("");
    setSuggestions([]);
    setIsMobileSearchOpen(false);

    router.push(
      `/category/${slugify(item.mainName)}/${slugify(item.subName)}`
    );
  };

  // -----------------------------------------------------
  // 🔥 Close Mobile Search on Click Outside
  // -----------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setIsMobileSearchOpen(false);
        setSearchQuery("");
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/95 backdrop-blur-md py-1.5 border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative px-4 lg:px-0">
        
        {/* -------------------------------------- */}
        {/* LOGO */}
        {/* -------------------------------------- */}
        <Link href="/" className="flex items-center group">
          <div className="relative w-[120px] h-[70px]">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </div>
        </Link>

        {/* -------------------------------------- */}
        {/* MOBILE RIGHT ICONS */}
        {/* -------------------------------------- */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* -------------------------------------- */}
        {/* DESKTOP SEARCH BAR */}
        {/* -------------------------------------- */}
        <div className="hidden lg:flex flex-1 justify-center mx-8 relative">
          <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0313ff] to-[#F27005] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-700"></div>

              <div className="relative flex w-full rounded-full overflow-hidden shadow-lg">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search subcategories..."
                  className="flex-1 px-6 py-3.5 text-gray-900 bg-white focus:outline-none placeholder-gray-500 font-medium"
                />

                <Button
                  type="submit"
                  variant="secondary"
                  size="medium"
                  className="rounded-l-none border-l border-white/20"
                  leftIcon={<Search className="w-5 h-5" />}
                >
                  Search
                </Button>
              </div>
            </div>
          </form>

          {suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
              {suggestions.map((item) => (
                <div
                  key={item.subId}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(item)}
                >
                  <span className="font-medium text-gray-800">{item.subName}</span>
                  <span className="text-gray-500 text-sm"> — {item.mainName}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* -------------------------------------- */}
        {/* RIGHT SIDE DESKTOP LINKS */}
        {/* -------------------------------------- */}
        <div className="hidden lg:flex items-center space-x-1">
          <Link
            href="/category"
            className="text-[#0215A6] hover:text-[#0313ff] transition-all duration-300 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 relative group"
          >
            Categories
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0313ff] to-[#F27005] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/about"
            className="text-[#0215A6] hover:text-[#0313ff] transition-all duration-300 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0313ff] to-[#F27005] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/blog"
            className="text-[#0215A6] hover:text-[#0313ff] transition-all duration-300 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 relative group"
          >
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0313ff] to-[#F27005] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* MOBILE FLOATING SEARCH */}
      {/* -------------------------------------- */}
      {isMobileSearchOpen && (
        <div
          ref={mobileSearchRef}
          className="lg:hidden absolute top-full left-0 right-0 mt-2 px-4"
        >
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <div className="flex rounded-lg overflow-hidden shadow-md bg-white ">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search subcategories..."
                className="flex-1 px-4 py-3 text-gray-900 focus:outline-none"
                autoFocus
              />
              <Button
                variant="secondary"
                size="small"
                className="rounded-l-none"
                leftIcon={<Search className="w-4 h-4" />}
              />
            </div>

            {suggestions.length > 0 && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto mt-1">
                {suggestions.map((item) => (
                  <div
                    key={item.subId}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    <span className="font-medium text-gray-800">{item.subName}</span>
                    <span className="text-gray-500 text-sm"> — {item.mainName}</span>
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      )}

      {/* -------------------------------------- */}
      {/* MOBILE MENU */}
      {/* -------------------------------------- */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg z-40">
          <div className="p-4 space-y-0">
            <Link
              href="/about"
              className="block text-gray-700 hover:text-[#0313ff] font-semibold py-1 px-4 rounded-lg hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/blog"
              className="block text-gray-700 hover:text-[#0313ff] font-semibold py-3 px-4 rounded-lg hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>

            <Link
              href="/category"
              className="block text-gray-700 hover:text-[#0313ff] font-semibold py-3 px-4 rounded-lg hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>

            <div className="pt-1">
              <Link href="/">
                <Button variant="primary" size="medium" className="w-full justify-center">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
