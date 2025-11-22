// app/(main)/category/[mainCategory]/[subCategory]/[productId]/page.jsx
import ProductDetailsPage from '@/page-components/ProductPage/ProductDetailsPage';
import ProductStructuredData from '@/components/seo/ProductStructuredData';
import { unslugify, extractProductId, createProductSlug } from '@/lib/slugify';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { mainCategory, subCategory, productId } = await params;

  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);
  const productSlug = extractProductId(productId);

  // Fetch products by category and find matching product by slug
  let productData = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?mainCategoryName=${encodeURIComponent(mainName)}&subCategoryName=${encodeURIComponent(subName)}`,
      { cache: 'no-store' }
    );
    if (response.ok) {
      const data = await response.json();
      // Find product matching the slug
      const products = data.data?.products || [];
      productData = products.find(p => createProductSlug(p.title) === productSlug);
    }
  } catch (error) {
    console.error('Error fetching product for SEO:', error);
  }

  const title = productData?.seo?.title || productData?.title || `Best ${subName} (${mainName})`;
  const description = productData?.seo?.description || productData?.description || 
    `Detailed review and specifications for ${subName.toLowerCase()} in ${mainName.toLowerCase()}. Expert analysis, features, and buying recommendations.`;
  const keywords = productData?.seo?.keywords || [
    `${subName}`,
    `${mainName}`,
    `best ${subName.toLowerCase()}`,
    `${subName.toLowerCase()} review`,
    `buy ${subName.toLowerCase()}`,
    `${productData?.brand || subName} review`,
    'product review',
    'buying guide',
  ];

  const productUrl = `https://bestbuyersview.com/category/${mainCategory}/${subCategory}/${productId}`;
  const imageUrl = productData?.images?.[0]?.url || 'https://bestbuyersview.com/og-image.jpg';

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: productData?.title || title,
      description,
      url: productUrl,
      siteName: 'Best Buyers View',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: productData?.title || title,
        },
      ],
      type: 'article',
      article: {
        publishedTime: productData?.createdAt,
        modifiedTime: productData?.updatedAt,
        section: mainName,
        tags: keywords,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: productData?.title || title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function Page({ params }) {
  const { mainCategory, subCategory, productId } = await params;

  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);
  const productSlug = extractProductId(productId);

  // Fetch products by category and find matching product by slug
  let productData = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?mainCategoryName=${encodeURIComponent(mainName)}&subCategoryName=${encodeURIComponent(subName)}`,
      { cache: 'no-store' }
    );
    if (response.ok) {
      const data = await response.json();
      // Find product matching the slug
      const products = data.data?.products || [];
      productData = products.find(p => createProductSlug(p.title) === productSlug);
    }
  } catch (err) {
    console.error('Error fetching product:', err);
  }

  return (
    <>
      {productData && <ProductStructuredData product={productData} />}
      <ProductDetailsPage product={productData} />
    </>
  );
}
