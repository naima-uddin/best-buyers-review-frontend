// app/(main)/category/[mainCategory]/[subCategory]/[productId]/page.jsx
import ProductDetailsPage from '@/page-components/ProductPage/ProductDetailsPage';
import ProductStructuredData from '@/components/seo/ProductStructuredData';
import { unslugify, extractProductId } from '@/lib/slugify';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { mainCategory, subCategory, productId } = await params;

  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);
  const actualProductId = extractProductId(productId);

  // Fetch product data server-side for SEO
  let productData = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${actualProductId}`, {
      cache: 'no-store'
    });
    if (response.ok) {
      const data = await response.json();
      productData = data.data;
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
  const { productId } = await params;
  const actualProductId = extractProductId(productId);

  // Fetch product data server-side
  let productData = null;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${actualProductId}`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      productData = data.data;
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
