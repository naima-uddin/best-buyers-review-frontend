"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Search, Menu, X, Sparkles } from "lucide-react";
import Button from "@/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="bg-white/95 backdrop-blur-md py-4 border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative">
            <Image
              src="/logo.png"
              width={120}
              height={170}
              alt="Logo"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>

        {/* Center: Search bar */}
        <div className="hidden lg:flex flex-1 justify-center mx-8">
          <form className="w-full max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0313ff] to-[#F27005] rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex w-full rounded-full overflow-hidden shadow-lg">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, categories, brands..."
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
        </div>

        {/* Right: Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link
            href="/about"
            className="text-gray-700 hover:text-[#0313ff] transition-all duration-300 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0313ff] to-[#F27005] transition-all duration-300 group-hover:w-full"></span>
          </Link>

          <Link
            href="/blog"
            className="text-gray-700 hover:text-[#0313ff] transition-all duration-300 font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 relative group"
          >
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#0313ff] to-[#F27005] transition-all duration-300 group-hover:w-full"></span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
          <div className="p-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex rounded-lg overflow-hidden shadow-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 px-4 py-3 text-gray-900 bg-gray-50 focus:outline-none"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  size="small"
                  className="rounded-l-none"
                  leftIcon={<Search className="w-4 h-4" />}
                />
              </div>
            </form>

            <Link
              href="/about"
              className="block text-gray-700 hover:text-[#0313ff] transition-colors font-semibold py-3 px-4 rounded-lg hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            <Link
              href="/blog"
              className="block text-gray-700 hover:text-[#0313ff] transition-colors font-semibold py-3 px-4 rounded-lg hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>

            <div className="pt-2">
              <Button
                variant="primary"
                size="medium"
                className="w-full justify-center"
                onClick={() => {
                  console.log("Get Started clicked");
                  setIsMenuOpen(false);
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
