// lib/seoHelpers.js
import { slugify, createProductSlug } from './slugify';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bestbuyersview.com";

// Helper function to generate correct product URL based on category hierarchy
const getProductUrl = (product, productSlug = null) => {
  const mainSlug = slugify(product.mainCategory?.name || '');
  const subSlug = slugify(product.subCategory?.name || '');
  // Generate slug from title + ID
  const slug = productSlug || createProductSlug(product.title, product._id);
  
  if (product.subSubCategory?.name) {
    const subSubSlug = slugify(product.subSubCategory.name);
    return `${SITE_URL}/category/${mainSlug}/${subSlug}/${subSubSlug}/${slug}`;
  }
  return `${SITE_URL}/category/${mainSlug}/${subSlug}/${slug}`;
};

/**
 * Generate comprehensive metadata for category pages
 * @param {string} mainCategory - Main category name
 * @param {string} subCategory - Subcategory name (optional)
 * @param {string} subSubCategory - Sub-subcategory name (optional)
 * @param {array} products - Products in this category (optional)
 * @returns {object} - Next.js metadata object
 */
export function generateCategoryMetadata(mainCategory, subCategory = null, subSubCategory = null, products = []) {
  const year = new Date().getFullYear();
  const month = new Date().toLocaleString('default', { month: 'long' });
  
  let title, description, url, keywords;

  if (subSubCategory) {
    title = `Best ${subSubCategory} - ${subCategory} (${mainCategory}) Reviews ${year}`;
    description = `Find the best ${subSubCategory.toLowerCase()} in ${subCategory.toLowerCase()}. Expert reviews, detailed comparisons, and comprehensive buying guide. Updated ${month} ${year}.`;
    url = `${SITE_URL}/category/${slugify(mainCategory)}/${slugify(subCategory)}/${slugify(subSubCategory)}`;
    keywords = [
      `best ${subSubCategory.toLowerCase()}`,
      `${subSubCategory.toLowerCase()} reviews`,
      `${subCategory.toLowerCase()} ${subSubCategory.toLowerCase()}`,
      `buy ${subSubCategory.toLowerCase()}`,
      `top ${subSubCategory.toLowerCase()}`,
    ];
  } else if (subCategory) {
    title = `Best ${subCategory} - ${mainCategory} Reviews & Buying Guide ${year}`;
    description = `Find the best ${subCategory.toLowerCase()} in ${mainCategory.toLowerCase()}. Expert reviews, detailed comparisons, and comprehensive buying guide. Updated ${month} ${year}.`;
    url = `${SITE_URL}/category/${slugify(mainCategory)}/${slugify(subCategory)}`;
    keywords = [
      `best ${subCategory.toLowerCase()}`,
      `${subCategory.toLowerCase()} reviews`,
      `${mainCategory.toLowerCase()} ${subCategory.toLowerCase()}`,
      `buy ${subCategory.toLowerCase()}`,
      `${subCategory.toLowerCase()} buying guide`,
      `top ${subCategory.toLowerCase()}`,
    ];
  } else {
    title = `Best ${mainCategory} Products - Reviews & Buying Guides ${year}`;
    description = `Explore the best ${mainCategory.toLowerCase()} products. Expert reviews, detailed comparisons, and comprehensive buying guides. Updated ${month} ${year}.`;
    url = `${SITE_URL}/category/${slugify(mainCategory)}`;
    keywords = [
      `best ${mainCategory.toLowerCase()}`,
      `${mainCategory.toLowerCase()} reviews`,
      `${mainCategory.toLowerCase()} buying guide`,
      `top ${mainCategory.toLowerCase()} products`,
    ];
  }

  // Add product-specific keywords if available
  if (products.length > 0) {
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].slice(0, 5);
    keywords.push(...brands.map(b => `${b.toLowerCase()} reviews`));
  }

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Best Buyers View',
      type: 'website',
      images: [
        {
          url: `${SITE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
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

/**
 * Generate comprehensive metadata for product pages
 * @param {object} product - Product object
 * @param {string} mainCategory - Main category slug
 * @param {string} subCategory - Subcategory slug
 * @returns {object} - Next.js metadata object
 */
export function generateProductMetadata(product, mainCategory, subCategory) {
  if (!product) {
    return {
      title: "Product Not Found | Best Buyers View",
      description: "The requested product could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = product.seo?.title || `${product.title} - Review & Buying Guide ${new Date().getFullYear()}`;
  const description = product.seo?.description || product.description || 
    `Detailed review of ${product.title}. Expert analysis, features, pros & cons, and buying recommendations. Make an informed decision with our comprehensive guide.`;
  
  const keywords = product.seo?.keywords || [
    product.title,
    `${product.title} review`,
    `buy ${product.title}`,
    `${product.brand} ${product.subCategory?.name}`,
    `best ${product.subCategory?.name}`,
    'product review',
    'buying guide',
  ].filter(Boolean);

  const productUrl = getProductUrl(product);
  const imageUrl = product.images?.[0]?.url || `${SITE_URL}/og-image.jpg`;

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: product.title || title,
      description,
      url: productUrl,
      siteName: 'Best Buyers View',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title || title,
        },
      ],
      type: 'article',
      article: {
        publishedTime: product.createdAt,
        modifiedTime: product.updatedAt,
        section: product.mainCategory?.name,
        tags: keywords,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title || title,
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

/**
 * Generate comprehensive metadata for blog pages
 * @param {object} blog - Blog object
 * @returns {object} - Next.js metadata object
 */
export function generateBlogMetadata(blog) {
  if (!blog) {
    return {
      title: "Blog Post Not Found | Best Buyers View",
      description: "The requested blog post could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${blog.seo?.title || blog.title} | Best Buyers View`;
  const description = blog.seo?.description || blog.excerpt || blog.description;
  const image = blog.featuredImage?.url || `${SITE_URL}/og-image.jpg`;
  const blogUrl = `${SITE_URL}/blog/${blog.slug}`;

  return {
    title,
    description,
    keywords: blog.seo?.keywords || blog.tags || [],
    alternates: {
      canonical: blogUrl,
    },
    openGraph: {
      title: blog.title,
      description,
      url: blogUrl,
      type: "article",
      publishedTime: blog.datePublished || blog.createdAt,
      modifiedTime: blog.dateModified || blog.updatedAt,
      images: [{ url: image }],
      authors: [blog.author?.name || "Best Buyers View"],
      section: "Blog",
      tags: blog.tags || [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description,
      images: [image],
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

/**
 * Generate breadcrumb items for category pages
 * @param {string} mainCategory - Main category name
 * @param {string} subCategory - Subcategory name (optional)
 * @param {string} subSubCategory - Sub-subcategory name (optional)
 * @param {string} productTitle - Product title (optional)
 * @returns {array} - Array of breadcrumb items
 */
export function generateCategoryBreadcrumbs(mainCategory, subCategory = null, subSubCategory = null, productTitle = null) {
  const breadcrumbs = [
    { name: "Categories", url: `${SITE_URL}/category` }
  ];

  if (mainCategory) {
    breadcrumbs.push({
      name: mainCategory,
      url: `${SITE_URL}/category/${slugify(mainCategory)}`
    });
  }

  if (subCategory) {
    breadcrumbs.push({
      name: subCategory,
      url: `${SITE_URL}/category/${slugify(mainCategory)}/${slugify(subCategory)}`
    });
  }

  if (subSubCategory) {
    breadcrumbs.push({
      name: subSubCategory,
      url: `${SITE_URL}/category/${slugify(mainCategory)}/${slugify(subCategory)}/${slugify(subSubCategory)}`
    });
  }

  if (productTitle) {
    // For breadcrumbs, we need to construct a minimal product object
    const productForUrl = {
      title: productTitle,
      mainCategory: { name: mainCategory },
      subCategory: { name: subCategory },
      subSubCategory: subSubCategory ? { name: subSubCategory } : null
    };
    const productUrl = getProductUrl(productForUrl);
    
    breadcrumbs.push({
      name: productTitle,
      url: productUrl
    });
  }

  return breadcrumbs;
}

/**
 * Generate breadcrumb items for blog pages
 * @param {string} blogTitle - Blog title (optional)
 * @returns {array} - Array of breadcrumb items
 */
export function generateBlogBreadcrumbs(blogTitle = null) {
  const breadcrumbs = [
    { name: "Blog", url: `${SITE_URL}/blog` }
  ];

  if (blogTitle) {
    breadcrumbs.push({
      name: blogTitle,
      url: `${SITE_URL}/blog/${slugify(blogTitle)}`
    });
  }

  return breadcrumbs;
}
