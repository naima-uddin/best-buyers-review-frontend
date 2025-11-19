import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import "hover.css/css/hover-min.css";
import { CategoryProvider } from "@/context/CategoryContext";
import { CompareProvider } from "@/context/CompareContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Best Buyers View",
    template: "%s | Best Buyers View",
  },
  description: "Discover, Compare & Pick the Best",
  twitter:{
    card: "summary_large_image",
    title: "Best Buyers View",
    description: "Discover, Compare & Pick the Best",
    site: "https://bestbuyersview.com"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <AuthProvider>
          <CategoryProvider>
            <CompareProvider>
              {children}
            </CompareProvider>
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
