import BlogListClient from '@/components/blog/BlogListClient';
import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';

export const metadata = {
  title: 'Blog | Budget Friendly',
  description: 'Read our latest articles on beauty tips, skincare guides, product reviews, and more.',
};

export default function BlogPage() {
  return (
    <>
    
    
    <Navbar/>
    
    <BlogListClient />
    <Footer/>
    </>
  



);
}
