// app/(main)/category/[mainCategory]/[subCategory]/[slug]/[productSlug]/page.jsx
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
        // Generate slug from title + ID
        const productSlug = createProductSlug(product.title, product._id);

        return {
          mainCategory: mainSlug,
          subCategory: subSlug,
          slug: subSubSlug,
          productSlug: productSlug,
        };
      })
      .filter(param => param.mainCategory && param.subCategory && param.slug && param.productSlug);
  } catch (error) {
    console.error('Error in sub-sub category product generateStaticParams:', error);
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { mainCategory, subCategory, slug, productSlug } = await params;

  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);
  const subSubName = unslugify(slug);
  const productIdSlug = extractProductId(productSlug);

  // Fetch product by ID directly
  let productData = null;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productIdSlug}`,
      { next: { revalidate: 1800 } }
    );
    if (response.ok) {
      const data = await response.json();
      productData = data.data;
      console.log('✅ Found product for metadata:', productData?.title);
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

  const productUrl = `${SITE_URL}/category/${mainCategory}/${subCategory}/${slug}/${productSlug}`;
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
  const { mainCategory, subCategory, slug, productSlug } = await params;

  const mainName = unslugify(mainCategory);
  const subName = unslugify(subCategory);
  const subSubName = unslugify(slug);
  const productIdSlug = extractProductId(productSlug);

  console.log('🔍 Page params:', { mainCategory, subCategory, slug, productSlug });
  console.log('🔍 Extracted ID:', productIdSlug);
  console.log('🔍 Categories:', { mainName, subName, subSubName });

  // Fetch product directly by ID first (more reliable)
  let productData = null;
  
  try {
    // Method 1: Try to get product by ID directly
    const directResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productIdSlug}`,
      { next: { revalidate: 1800 } }
    );
    
    if (directResponse.ok) {
      const directData = await directResponse.json();
      productData = directData.data;
      console.log('✅ Found product by ID:', productData?.title);
    } else {
      console.log('⚠️ Direct ID fetch failed, trying category query...');
      
      // Method 2: Fallback to category query
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?mainCategoryName=${encodeURIComponent(mainName)}&subCategoryName=${encodeURIComponent(subName)}&subSubCategoryName=${encodeURIComponent(subSubName)}`,
        { next: { revalidate: 1800 } }
      );
      
      if (response.ok) {
        const data = await response.json();
        const products = data.data?.products || [];
        console.log('📦 Found', products.length, 'products in category');
        
        productData = products.find(p => p._id === productIdSlug);
        
        if (productData) {
          console.log('✅ Found product via category query:', productData.title);
        } else {
          console.log('❌ Product not in category. Available IDs:', products.map(p => p._id).slice(0, 5));
        }
      } else {
        console.log('❌ Category query failed:', response.status);
      }
    }
  } catch (err) {
    console.error('❌ Error fetching product:', err);
  }

  const breadcrumbItems = [
    { name: "Categories", url: `${SITE_URL}/category` },
    { name: mainName, url: `${SITE_URL}/category/${mainCategory}` },
    { name: subName, url: `${SITE_URL}/category/${mainCategory}/${subCategory}` },
    { name: subSubName, url: `${SITE_URL}/category/${mainCategory}/${subCategory}/${slug}` },
  ];

  if (productData) {
    breadcrumbItems.push({
      name: productData.title,
      url: `${SITE_URL}/category/${mainCategory}/${subCategory}/${slug}/${productSlug}`
    });
  }

  // If no product found, show error page
  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-4">
          We couldn't find the product you're looking for in {subSubName}.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          ID: {productIdSlug}
        </p>
        <a
          href={`/category/${mainCategory}/${subCategory}/${slug}`}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Browse {subSubName}
        </a>
      </div>
    );
  }

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <ProductStructuredData product={productData} />
      <ProductDetailsPage product={productData} />
    </>
  );
}
