import ProductDetailsPage from '@/page-components/ProductPage/ProductDetailsPage'

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }) {
  const { mainCategory, subCategory } = params;
  
  // Format category names
  const formatName = (name) => {
    if (!name) return '';
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const mainName = searchParams?.mainName || formatName(mainCategory);
  const subName = searchParams?.subName || formatName(subCategory);
  
  const title = `Best ${subName} (${mainName})`;
  const description = `Detailed review and specifications for ${subName.toLowerCase()} in ${mainName.toLowerCase()}. Expert analysis, features, and buying recommendations.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

export default function Page() {
  return <ProductDetailsPage />;
}