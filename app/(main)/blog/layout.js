import { BlogDataProvider } from "@/page-components/BlogPage/BlogDataProvider";

export default function Layout({ children }) {
  return <>
  
  <BlogDataProvider>
    {children}
  </BlogDataProvider>
  </>;
}
