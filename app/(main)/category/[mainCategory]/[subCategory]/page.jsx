import ProductByCategory from "@/page-components/ProductPage/ProductByCategory";
import CategoryStructuredData from "@/components/seo/CategoryStructuredData";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Generate metadata function
export async function generateMetadata({ params, searchParams }) {
  const { mainCategory, subCategory } = params;
  const mainName = searchParams.mainName || decodeURIComponent(mainCategory);
  const subName = searchParams.subName || decodeURIComponent(subCategory);
  
  const formatName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formattedMainName = formatName(mainName);
  const formattedSubName = formatName(subName);
  
  const title = `${formattedSubName} (${formattedMainName})`;
  const description = `Find the best ${formattedSubName.toLowerCase()} for ${formattedMainName.toLowerCase()}. Expert reviews, comparisons, and buying guide updated ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default function Page({ params, searchParams }) {
  const { mainCategory, subCategory } = params;
  const mainName = searchParams?.mainName || decodeURIComponent(mainCategory);
  const subName = searchParams?.subName || decodeURIComponent(subCategory);

  const formatName = (name) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formattedMainName = formatName(mainName);
  const formattedSubName = formatName(subName);

  return (
    <>
      <CategoryStructuredData
        mainCategoryName={formattedMainName}
        subCategoryName={formattedSubName}
        products={[]} 
      />
      <ProductByCategory />
    </>
  );
}
