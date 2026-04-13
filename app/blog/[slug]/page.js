import BlogDetailClient from '@/components/blog/BlogDetailClient';
import { Footer } from '@/components/common/Footer';
import Navbar from '@/components/common/Navbar';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  
  try {
    const resp = await fetch(`${API}/blog/${slug}`, {
      cache: 'no-store',
    });
    
    if (resp.ok) {
      const data = await resp.json();
      const blog = data.blog || data.post;
      
      // Helper to safely extract image URL
      const getImageUrl = (featuredImage, thumbnail) => {
        if (featuredImage?.url) return featuredImage.url;
        if (typeof featuredImage === 'string') return featuredImage;
        if (thumbnail) return thumbnail;
        return null;
      };
      
      const imageUrl = getImageUrl(blog?.featuredImage, blog?.thumbnail);
      
      return {
        title: `${blog?.title || 'Blog'} | Budget Friendly`,
        description: blog?.excerpt || blog?.content?.substring(0, 160) || 'Read this article on Budget Friendly',
        openGraph: {
          title: blog?.title,
          description: blog?.excerpt || blog?.content?.substring(0, 160),
          images: imageUrl ? [{ url: imageUrl }] : [],
        },
      };
    }
  } catch (error) {
    console.error('Failed to fetch blog metadata:', error);
  }
  
  return {
    title: 'Blog | Budget Friendly',
    description: 'Read this article on Budget Friendly',
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  return (
  <>
  <Navbar/>
  
  <BlogDetailClient slug={slug} />
  <Footer/>
  </>
  


)
}
