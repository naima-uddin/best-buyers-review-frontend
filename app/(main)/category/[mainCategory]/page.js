import ProductByCategory from "@/page-components/ProductPage/ProductByCategory";
import { unslugify, slugify } from "@/lib/slugify";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

// Use ISR to revalidate main category pages every 30 minutes
export const revalidate = 1800;

// Generate static params for all main categories at build time
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error('Failed to fetch products for main category static generation');
      return [];
    }

    const data = await response.json();
    const products = data.data?.products || [];

    // Create unique set of main categories
    const mainCategories = new Set();
    products.forEach((product) => {
      if (product.mainCategory?.name) {
        const mainSlug = slugify(product.mainCategory.name);
        mainCategories.add(mainSlug);
      }
    });

    return Array.from(mainCategories).map((mainCategory) => ({
      mainCategory,
    }));
  } catch (error) {
    console.error('Error in main category generateStaticParams:', error);
    return [];
  }
}

// Fetch subcategories for a main category
async function getSubcategories(mainCategoryName) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products?mainCategoryName=${encodeURIComponent(mainCategoryName)}`,
      { next: { revalidate: 1800 } }
    );

    if (!response.ok) return [];

    const data = await response.json();
    const products = data.data?.products || [];

    // Extract unique subcategories
    const subcategories = [...new Set(products.map(p => p.subCategory?.name).filter(Boolean))];
    return subcategories;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

// Generate metadata for main category page
export async function generateMetadata({ params }) {
  const { mainCategory } = await params;
  const mainName = unslugify(mainCategory);
  const subcategories = await getSubcategories(mainName);

  const title = `Best ${mainName} Products - Reviews & Buying Guides ${new Date().getFullYear()}`;
  const description = `Explore the best ${mainName.toLowerCase()} products. Expert reviews, detailed comparisons, and comprehensive buying guides across ${subcategories.length > 0 ? subcategories.join(', ') : 'all'} categories. Updated ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}.`;
  const categoryUrl = `${SITE_URL}/category/${mainCategory}`;

  const keywords = [
    `best ${mainName.toLowerCase()}`,
    `${mainName.toLowerCase()} reviews`,
    `${mainName.toLowerCase()} buying guide`,
    `top ${mainName.toLowerCase()} products`,
    `${mainName.toLowerCase()} comparison`,
    `buy ${mainName.toLowerCase()}`,
    ...subcategories.map(sub => `best ${sub.toLowerCase()}`),
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
          alt: `${mainName} Products`,
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
  const { mainCategory } = await params;
  const mainName = unslugify(mainCategory);
  const subcategories = await getSubcategories(mainName);

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Categories",
        "item": `${SITE_URL}/category`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": mainName,
        "item": `${SITE_URL}/category/${mainCategory}`
      }
    ]
  };

  // CollectionPage Schema for main category
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${mainName} Products`,
    "description": `Browse our collection of ${mainName.toLowerCase()} products with expert reviews and buying guides.`,
    "url": `${SITE_URL}/category/${mainCategory}`,
    "about": {
      "@type": "Thing",
      "name": mainName
    },
    "hasPart": subcategories.map(sub => ({
      "@type": "WebPage",
      "name": sub,
      "url": `${SITE_URL}/category/${mainCategory}/${slugify(sub)}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <ProductByCategory />
    </>
  );
}
