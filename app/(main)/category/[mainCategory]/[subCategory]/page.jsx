import ProductByCategory from "@/page-components/ProductPage/ProductByCategory";
import CategoryStructuredData from "@/components/seo/CategoryStructuredData";

// Force dynamic rendering for this page
export const dynamic = "force-dynamic";

// Generate metadata function
export async function generateMetadata({ params }) {
  const { mainCategory, subCategory } = params;
  const mainName = decodeURIComponent(mainCategory);
  const subName = decodeURIComponent(subCategory);

  const title = `${subName} (${mainName})`;
  const description = `Find the best ${subName.toLowerCase()} for ${mainName.toLowerCase()}. Expert reviews, comparisons, and buying guide updated ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default function Page({ params }) {
  const { mainCategory, subCategory } = params;
  const mainName = decodeURIComponent(mainCategory);
  const subName = decodeURIComponent(subCategory);

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
