import ProductByCategory from "@/page-components/ProductPage/ProductByCategory";
import CategoryStructuredData from "@/components/seo/CategoryStructuredData";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { unslugify, slugify } from "@/lib/slugify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

// Use ISR to revalidate sub-sub category pages every 30 minutes
export const revalidate = 1800;

// Generate static params for all sub-sub categories at build time
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

    // Create unique combinations of mainCategory, subCategory, and subSubCategory
    const categoryTriples = new Set();
    products.forEach((product) => {
      if (
        product.mainCategory?.name &&
        product.subCategory?.name &&
        product.subSubCategory?.name
      ) {
        const mainSlug = slugify(product.mainCategory.name);
        const subSlug = slugify(product.subCategory.name);
        const subSubSlug = slugify(product.subSubCategory.name);
        categoryTriples.add(`${mainSlug}|${subSlug}|${subSubSlug}`);
      }
    });

    return Array.from(categoryTriples).map((triple) => {
      const [mainCategory, subCategory, subSubCategory] = triple.split('|');
      return { mainCategory, subCategory, subSubCategory };
    });
  } catch (error) {
    console.error('Error in sub-sub category generateStaticParams:', error);
    return [];
  }
}

// Generate metadata function for sub-sub categories
export async function generateMetadata({ params }) {
  const { mainCategory, subCategory, subSubCategory } = await params;
  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);
  const subSubName = unslugify(subSubCategory);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  const title = `Best ${subSubName} - ${subName} (${mainName}) Reviews ${currentYear}`;
  const description = `Find the best ${subSubName.toLowerCase()} in ${subName.toLowerCase()}. Expert reviews, detailed comparisons, and comprehensive buying guide. Updated ${currentMonth} ${currentYear}.`;
  const categoryUrl = `${SITE_URL}/category/${mainCategory}/${subCategory}/${subSubCategory}`;

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

// Sub-sub category page component
export default async function SubSubCategoryPage({ params }) {
  const { mainCategory, subCategory, subSubCategory } = await params;
  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);
  const subSubName = unslugify(subSubCategory);

  const categoryUrl = `${SITE_URL}/category/${mainCategory}/${subCategory}/${subSubCategory}`;

  // Fetch products for this sub-sub category
  let products = [];
  let pagination = null;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?mainCategoryName=${encodeURIComponent(mainName)}&subCategoryName=${encodeURIComponent(subName)}&subSubCategoryName=${encodeURIComponent(subSubName)}&page=1&limit=12`,
      {
        next: { revalidate: 1800 },
        cache: 'no-store'
      }
    );

    if (response.ok) {
      const data = await response.json();
      products = data.data?.products || [];
      pagination = data.data?.pagination || null;
    }
  } catch (error) {
    console.error('Error fetching sub-sub category products:', error);
  }

  // Breadcrumb data
  const breadcrumbs = [
    { name: 'Home', url: SITE_URL },
    { name: mainName, url: `${SITE_URL}/category/${mainCategory}` },
    { name: subName, url: `${SITE_URL}/category/${mainCategory}/${subCategory}` },
    { name: subSubName, url: categoryUrl }
  ];

  return (
    <>
      {/* Structured Data for SEO */}
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <CategoryStructuredData
        mainCategoryName={mainName}
        subCategoryName={subName}
        subSubCategoryName={subSubName}
        products={products}
      />

      {/* Main Component */}
      <ProductByCategory
        mainCategory={mainCategory}
        subCategory={subCategory}
        subSubCategory={subSubCategory}
        initialProducts={products}
        initialPagination={pagination}
      />
    </>
  );
}
