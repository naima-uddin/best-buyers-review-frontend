// app/(main)/category/[mainCategory]/[subCategory]/[subSubCategory]/[productId]/page.jsx
import ProductDetailsPage from '@/page-components/ProductPage/ProductDetailsPage';
import ProductStructuredData from '@/components/seo/ProductStructuredData';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import { unslugify, extractProductId, createProductSlug, slugify } from '@/lib/slugify';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

// Use ISR to revalidate product pages every 30 minutes
export const revalidate = 1800;

// Generate static params for all products with sub-sub categories at build time
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error('Failed to fetch products for sub-sub category static generation');
      return [];
    }

    const data = await response.json();
    const products = data.data?.products || [];

    // Only include products with sub-sub categories
    return products
      .filter(product => product.subSubCategory?.name)
      .map((product) => {
        const mainSlug = slugify(product.mainCategory?.name || '');
        const subSlug = slugify(product.subCategory?.name || '');
        const subSubSlug = slugify(product.subSubCategory?.name || '');
        const productSlug = createProductSlug(product.title, product._id);

        return {
          mainCategory: mainSlug,
          subCategory: subSlug,
          subSubCategory: subSubSlug,
          productId: productSlug,
        };
      })
      .filter(param => param.mainCategory && param.subCategory && param.subSubCategory && param.productId);
  } catch (error) {
    console.error('Error in sub-sub category product generateStaticParams:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { mainCategory, subCategory, subSubCategory, productId } = await params;

  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);
  const subSubName = unslugify(subSubCategory);
  const productSlug = extractProductId(productId);

  // Fetch products by category and find matching product by slug
  let productData = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?mainCategoryName=${encodeURIComponent(mainName)}&subCategoryName=${encodeURIComponent(subName)}&subSubCategoryName=${encodeURIComponent(subSubName)}`,
      { next: { revalidate: 1800 } } // Cache for 30 minutes
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

  const title = productData?.seo?.title || productData?.title || `Best ${subSubName} - ${subName} (${mainName})`;
  const description = productData?.seo?.description || productData?.description || 
    `Detailed review and specifications for ${subSubName.toLowerCase()} in ${subName.toLowerCase()}. Expert analysis, features, and buying recommendations.`;
  const keywords = productData?.seo?.keywords || [
    `${subSubName}`,
    `${subName}`,
    `${mainName}`,
    `best ${subSubName.toLowerCase()}`,
    `${subSubName.toLowerCase()} review`,
    `buy ${subSubName.toLowerCase()}`,
    `${productData?.brand || subSubName} review`,
    'product review',
    'buying guide',
  ];

  const productUrl = `${SITE_URL}/category/${mainCategory}/${subCategory}/${subSubCategory}/${productId}`;
  const imageUrl = productData?.images?.[0]?.url || `${SITE_URL}/og-image.jpg`;

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
        section: `${mainName} / ${subName} / ${subSubName}`,
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
  const { mainCategory, subCategory, subSubCategory, productId } = await params;

  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);
  const subSubName = unslugify(subSubCategory);
  const productSlug = extractProductId(productId);

  // Fetch products by category and find matching product by slug
  let productData = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?mainCategoryName=${encodeURIComponent(mainName)}&subCategoryName=${encodeURIComponent(subName)}&subSubCategoryName=${encodeURIComponent(subSubName)}`,
      { next: { revalidate: 1800 } } // Cache for 30 minutes
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

  const breadcrumbItems = [
    { name: "Categories", url: `${SITE_URL}/category` },
    { name: mainName, url: `${SITE_URL}/category/${mainCategory}` },
    { name: subName, url: `${SITE_URL}/category/${mainCategory}/${subCategory}` },
    { name: subSubName, url: `${SITE_URL}/category/${mainCategory}/${subCategory}/${subSubCategory}` },
  ];

  if (productData) {
    breadcrumbItems.push({
      name: productData.title,
      url: `${SITE_URL}/category/${mainCategory}/${subCategory}/${subSubCategory}/${productId}`
    });
  }

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      {productData && <ProductStructuredData product={productData} />}
      <ProductDetailsPage product={productData} />
    </>
  );
}
