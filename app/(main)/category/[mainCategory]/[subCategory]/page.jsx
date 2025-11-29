import ProductByCategory from "@/page-components/ProductPage/ProductByCategory";
import CategoryStructuredData from "@/components/seo/CategoryStructuredData";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import { unslugify, slugify } from "@/lib/slugify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

// Use ISR to revalidate subcategory pages every 30 minutes
export const revalidate = 1800;

// Generate static params for all subcategories at build time
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error('Failed to fetch products for subcategory static generation');
      return [];
    }

    const data = await response.json();
    const products = data.data?.products || [];

    // Create unique combinations of mainCategory and subCategory
    const categoryPairs = new Set();
    products.forEach((product) => {
      if (product.mainCategory?.name && product.subCategory?.name) {
        const mainSlug = slugify(product.mainCategory.name);
        const subSlug = slugify(product.subCategory.name);
        categoryPairs.add(`${mainSlug}|${subSlug}`);
      }
    });

    return Array.from(categoryPairs).map((pair) => {
      const [mainCategory, subCategory] = pair.split('|');
      return { mainCategory, subCategory };
    });
  } catch (error) {
    console.error('Error in subcategory generateStaticParams:', error);
    return [];
  }
}

// Generate metadata function
export async function generateMetadata({ params }) {
  const { mainCategory, subCategory } = await params;
  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);

  const title = `Best ${subName} - ${mainName} Reviews & Buying Guide ${new Date().getFullYear()}`;
  const description = `Find the best ${subName.toLowerCase()} in ${mainName.toLowerCase()}. Expert reviews, detailed comparisons, and comprehensive buying guide. Updated ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}.`;
  const categoryUrl = `${SITE_URL}/category/${mainCategory}/${subCategory}`;

  const keywords = [
    `best ${subName.toLowerCase()}`,
    `${subName.toLowerCase()} reviews`,
    `${mainName.toLowerCase()} ${subName.toLowerCase()}`,
    `buy ${subName.toLowerCase()}`,
    `${subName.toLowerCase()} buying guide`,
    `top ${subName.toLowerCase()}`,
    `${subName.toLowerCase()} comparison`,
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
          alt: `${subName} - ${mainName}`,
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

export default async function Page({ params }) {
  const { mainCategory, subCategory } = await params;
  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);

  const breadcrumbItems = [
    { name: "Categories", url: `${SITE_URL}/category` },
    { name: mainName, url: `${SITE_URL}/category/${mainCategory}` },
    { name: subName, url: `${SITE_URL}/category/${mainCategory}/${subCategory}` }
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <CategoryStructuredData
        mainCategoryName={mainName}
        subCategoryName={subName}
        products={[]}
      />
      <ProductByCategory />
    </>
  );
}
