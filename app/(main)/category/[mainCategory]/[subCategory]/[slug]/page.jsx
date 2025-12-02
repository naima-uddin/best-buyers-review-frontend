// This route handles BOTH:
// 1. Sub-sub-category pages: /category/main/sub/subsub
// 2. Product pages without sub-sub-category: /category/main/sub/product-slug-id

import ProductByCategory from "@/page-components/ProductPage/ProductByCategory";
import ProductDetailsPage from '@/page-components/ProductPage/ProductDetailsPage';
import CategoryStructuredData from "@/components/seo/CategoryStructuredData";
import ProductStructuredData from '@/components/seo/ProductStructuredData';
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { unslugify, slugify, extractProductId, createProductSlug } from "@/lib/slugify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

export const revalidate = 1800;

// Generate static params for both sub-sub categories AND products without sub-sub-category
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error('Failed to fetch products for static generation');
      return [];
    }

    const data = await response.json();
    const products = data.data?.products || [];

    const params = [];
    const categoryTriples = new Set();

    products.forEach((product) => {
      if (product.mainCategory?.name && product.subCategory?.name) {
        const mainSlug = slugify(product.mainCategory.name);
        const subSlug = slugify(product.subCategory.name);

        if (product.subSubCategory?.name) {
          // Add sub-sub-category page
          const subSubSlug = slugify(product.subSubCategory.name);
          const key = `${mainSlug}|${subSlug}|${subSubSlug}`;
          if (!categoryTriples.has(key)) {
            categoryTriples.add(key);
            params.push({
              mainCategory: mainSlug,
              subCategory: subSlug,
              slug: subSubSlug
            });
          }
        } else {
          // Add product page (no sub-sub-category)
          // Generate slug from title + ID
          const productSlug = createProductSlug(product.title, product._id);
          params.push({
            mainCategory: mainSlug,
            subCategory: subSlug,
            slug: productSlug
          });
        }
      }
    });

    return params;
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

// Determine if slug is a product or sub-sub-category
async function getPageType(mainName, subName, slug) {
  // Try to extract product ID from slug (format: title-slug)
  const possibleProductSlug = extractProductId(slug);
  
  console.log('🔍 getPageType - slug:', slug);
  console.log('🔍 getPageType - extracted ID:', possibleProductSlug);
  
  // First, try to fetch product directly by ID
  try {
    const directResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${possibleProductSlug}`,
      { next: { revalidate: 1800 } }
    );
    
    if (directResponse.ok) {
      const directData = await directResponse.json();
      const product = directData.data;
      
      // Verify it doesn't have sub-sub-category (should be on different route)
      if (product && !product.subSubCategory?.name) {
        console.log('✅ Found product without sub-sub-category:', product.title);
        return { type: 'product', data: product };
      } else if (product && product.subSubCategory?.name) {
        console.log('⚠️ Product has sub-sub-category, wrong route');
      }
    } else {
      console.log('⚠️ Product ID not found:', possibleProductSlug);
    }
  } catch (error) {
    console.error('❌ Error checking for product:', error);
  }

  // If not a product, check if it's a sub-sub-category
  const subSubName = unslugify(slug);
  try {
    const categoryResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?mainCategoryName=${encodeURIComponent(mainName)}&subCategoryName=${encodeURIComponent(subName)}&subSubCategoryName=${encodeURIComponent(subSubName)}&page=1&limit=12`,
      { next: { revalidate: 1800 } }
    );
    
    if (categoryResponse.ok) {
      const categoryData = await categoryResponse.json();
      const products = categoryData.data?.products || [];
      
      if (products.length > 0) {
        return {
          type: 'subSubCategory',
          data: {
            products,
            pagination: categoryData.data?.pagination || null,
            name: subSubName
          }
        };
      }
    }
  } catch (error) {
    console.error('Error checking for sub-sub-category:', error);
  }

  return { type: 'unknown', data: null };
}

export async function generateMetadata({ params }) {
  const { mainCategory, subCategory, slug } = await params;
  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);

  const pageType = await getPageType(mainName, subName, slug);

  if (pageType.type === 'product') {
    const product = pageType.data;
    const productSlug = extractProductId(slug);
    const productUrl = `${SITE_URL}/category/${mainCategory}/${subCategory}/${slug}`;
    const title = product?.seo?.title || product?.title || `Best ${subName} (${mainName})`;
    const description = product?.seo?.description || product?.description ||
      `Detailed review and specifications for ${subName.toLowerCase()} in ${mainName.toLowerCase()}. Expert analysis, features, and buying recommendations.`;
    const keywords = product?.seo?.keywords || [
      `${subName}`,
      `${mainName}`,
      `best ${subName.toLowerCase()}`,
      `${subName.toLowerCase()} review`,
      `buy ${subName.toLowerCase()}`,
      `${product?.brand || subName} review`,
      'product review',
      'buying guide',
    ];
    const imageUrl = product?.images?.[0]?.url || `${SITE_URL}/og-image.jpg`;

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: productUrl,
      },
      openGraph: {
        title: product?.title || title,
        description,
        url: productUrl,
        siteName: 'Best Buyers View',
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product?.title || title,
          },
        ],
        type: 'article',
        article: {
          publishedTime: product?.createdAt,
          modifiedTime: product?.updatedAt,
          section: mainName,
          tags: keywords,
        },
      },
      twitter: {
        card: 'summary_large_image',
        title: product?.title || title,
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
  } else if (pageType.type === 'subSubCategory') {
    const subSubName = pageType.data.name;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const title = `Best ${subSubName} - ${subName} (${mainName}) Reviews ${currentYear}`;
    const description = `Find the best ${subSubName.toLowerCase()} in ${subName.toLowerCase()}. Expert reviews, detailed comparisons, and comprehensive buying guide. Updated ${currentMonth} ${currentYear}.`;
    const categoryUrl = `${SITE_URL}/category/${mainCategory}/${subCategory}/${slug}`;

    const keywords = [
      `best ${subSubName.toLowerCase()}`,
      `${subSubName.toLowerCase()} reviews`,
      `${subName.toLowerCase()} ${subSubName.toLowerCase()}`,
      `buy ${subSubName.toLowerCase()}`,
      `${subSubName.toLowerCase()} buying guide`,
      `top ${subSubName.toLowerCase()}`,
      `${subSubName.toLowerCase()} comparison`,
      `${mainName.toLowerCase()} ${subSubName.toLowerCase()}`,
    ];

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: categoryUrl,
      },
      openGraph: {
        title,
        description,
        url: categoryUrl,
        siteName: 'Best Buyers View',
        type: 'website',
        images: [
          {
            url: `${SITE_URL}/og-image.jpg`,
            width: 1200,
            height: 630,
            alt: `${subSubName} - ${subName} - ${mainName}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [`${SITE_URL}/og-image.jpg`],
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

  // Default fallback
  return {
    title: `${subName} - ${mainName}`,
    description: `Browse ${subName.toLowerCase()} products in ${mainName.toLowerCase()}.`,
  };
}

export default async function DynamicSlugPage({ params }) {
  const { mainCategory, subCategory, slug } = await params;
  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);

  const pageType = await getPageType(mainName, subName, slug);

  if (pageType.type === 'product') {
    // Render Product Details Page
    const product = pageType.data;
    const breadcrumbItems = [
      { name: "Categories", url: `${SITE_URL}/category` },
      { name: mainName, url: `${SITE_URL}/category/${mainCategory}` },
      { name: subName, url: `${SITE_URL}/category/${mainCategory}/${subCategory}` },
    ];

    if (product) {
      breadcrumbItems.push({
        name: product.title,
        url: `${SITE_URL}/category/${mainCategory}/${subCategory}/${slug}`
      });
    }

    return (
      <>
        <BreadcrumbSchema items={breadcrumbItems} />
        {product && <ProductStructuredData product={product} />}
        <ProductDetailsPage product={product} />
      </>
    );
  } else if (pageType.type === 'subSubCategory') {
    // Render Sub-Sub-Category Page
    const { products, pagination, name: subSubName } = pageType.data;
    const categoryUrl = `${SITE_URL}/category/${mainCategory}/${subCategory}/${slug}`;

    const breadcrumbs = [
      { name: 'Home', url: SITE_URL },
      { name: mainName, url: `${SITE_URL}/category/${mainCategory}` },
      { name: subName, url: `${SITE_URL}/category/${mainCategory}/${subCategory}` },
      { name: subSubName, url: categoryUrl }
    ];

    return (
      <>
        <BreadcrumbSchema breadcrumbs={breadcrumbs} />
        <CategoryStructuredData
          mainCategoryName={mainName}
          subCategoryName={subName}
          subSubCategoryName={subSubName}
          products={products}
        />
        <ProductByCategory
          mainCategory={mainCategory}
          subCategory={subCategory}
          subSubCategory={slug}
          initialProducts={products}
          initialPagination={pagination}
        />
      </>
    );
  }

  // 404 or not found
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold">Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}
