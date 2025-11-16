import { BlogDataProvider } from "@/page-components/BlogPage/BlogDataProvider";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <BlogDataProvider>
          {children}
        </BlogDataProvider>
      </body>
    </html>
  );
}