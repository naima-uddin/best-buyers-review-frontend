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
