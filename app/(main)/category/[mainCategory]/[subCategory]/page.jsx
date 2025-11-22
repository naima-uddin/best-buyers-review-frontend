import ProductByCategory from "@/page-components/ProductPage/ProductByCategory";
import CategoryStructuredData from "@/components/seo/CategoryStructuredData";
import { unslugify } from "@/lib/slugify";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Generate metadata function
export async function generateMetadata({ params }) {
  const { mainCategory, subCategory } = await params;
  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);

  const title = `Best ${subName} - ${mainName} Reviews & Buying Guide ${new Date().getFullYear()}`;
  const description = `Find the best ${subName.toLowerCase()} in ${mainName.toLowerCase()}. Expert reviews, detailed comparisons, and comprehensive buying guide. Updated ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}.`;
  const categoryUrl = `https://bestbuyersview.com/category/${mainCategory}/${subCategory}`;

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
          url: 'https://bestbuyersview.com/og-image.jpg',
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
      images: ['https://bestbuyersview.com/og-image.jpg'],
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

  return (
    <>
      <CategoryStructuredData
        mainCategoryName={mainName}
        subCategoryName={subName}
        products={[]}
      />
      <ProductByCategory />
    </>
  );
}
