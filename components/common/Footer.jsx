import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t pt-2 bg-gradient-to-b from-blue-100/30 to-blue-100/50 text-[#0215A6]">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-col md:items-center md:justify-center gap-4 mb-10">
          <Link href="/" className="group mx-auto md:mx-0">
            <Image
              src="/logo.png"
              width={110}
              height={150}
              alt="Logo"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl md:ml-8 text-center md:text-left">
            Your trusted source for expert product reviews and buying guides.
            Over 1 million shoppers trust us every week.
          </p>
        </div>

        {/* 3 COLUMNS ALWAYS IN ONE ROW */}
        <div className="grid grid-cols-3 gap-6">
          {/* Quick Links */}
          <div className="text-center">
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/category"
                  className="hover:text-[#0215A6] text-muted-foreground"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-[#0215A6] text-muted-foreground"
                >
                  Blog
                </Link>
              </li>
              
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#0215A6] text-muted-foreground"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center">
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-[#0215A6] text-muted-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#0215A6] text-muted-foreground"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/AdvertiserDisclosure"
                  className="hover:text-[#0215A6] text-muted-foreground"
                >
                  Advertiser Disclosure
                </Link>
              </li>
              
            </ul>
          </div>

          {/* Connect */}
          <div className="text-center">
            <h3 className="font-bold text-lg mb-4">Connect With Us</h3>

            <div className="flex justify-center gap-4 mb-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-[#0215A6]"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-[#0215A6]"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-[#0215A6]"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-[#0215A6]"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>

            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Get in touch with us for any questions or suggestions.
            </p>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="border-t mt-10 pt-6 text-center text-sm text-muted-foreground space-y-2">
          <p>© 2025 Best Buyers View All rights reserved.</p>
          <p>As an Amazon Associate we earn from qualifying purchases.</p>
        </div>
      </div>
    </footer>
  );
}
