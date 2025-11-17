import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-blue-100/30 to-blue-100/50 text-[#0215A6]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                width={120}
                height={40}
                alt="Logo"
                className="transition-opacity duration-300 hover:opacity-80"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Your trusted source for expert product reviews and buying guides. 
              Over 1 million shoppers trust us every week.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/category" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/AdvertiserDisclosure" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Advertiser Disclosure
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Connect</h3>
            <div className="flex gap-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-600 text-sm">
              Get in touch with us for any questions or suggestions.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t pt-8 text-center">
          <p className="text-gray-600 text-sm mb-2">
            © 2025 Best Buyers View. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs">
            As an Amazon Associate we earn from qualifying purchases.
          </p>
        </div>
      </div>
    </footer>
  );
}