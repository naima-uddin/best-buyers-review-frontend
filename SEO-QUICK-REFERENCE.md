# SEO Quick Reference Guide

## 🚀 Common Tasks

### Adding SEO to a New Page

#### 1. Static Page
```javascript
// app/(main)/new-page/page.js
export const metadata = {
  title: "Page Title | Best Buyers View",
  description: "Page description (150-160 characters)",
  keywords: ["keyword1", "keyword2", "keyword3"],
  alternates: {
    canonical: "https://bestbuyersview.com/new-page",
  },
  openGraph: {
    title: "Page Title",
    description: "Page description",
    url: "https://bestbuyersview.com/new-page",
    siteName: 'Best Buyers View',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

#### 2. Dynamic Page
```javascript
// app/(main)/[slug]/page.js
export async function generateMetadata({ params }) {
  const data = await fetchData(params.slug);
  
  return {
    title: data.seo?.title || data.title,
    description: data.seo?.description || data.description,
    alternates: {
      canonical: `https://bestbuyersview.com/${params.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const items = await fetchAllItems();
  return items.map((item) => ({ slug: item.slug }));
}

export const revalidate = 3600; // ISR: revalidate every hour
```

### Adding Structured Data

#### Import the Schema Component
```javascript
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FAQSchema from "@/components/seo/FAQSchema";
```

#### Add to Page
```javascript
export default function Page() {
  const breadcrumbs = [
    { name: "Home", url: "https://bestbuyersview.com" },
    { name: "Category", url: "https://bestbuyersview.com/category" },
  ];

  const faqs = [
    { question: "What is...", answer: "..." },
  ];

  return (
    <>
      <BreadcrumbSchema items={breadcrumbs} />
      <FAQSchema faqs={faqs} />
      {/* Your page content */}
    </>
  );
}
```

### Updating Sitemap Priority

Edit `app/sitemap.js`:
```javascript
// Find your page section and update priority (0.0 to 1.0)
{
  url: `${baseUrl}/your-page`,
  lastModified: new Date(),
  changeFrequency: "weekly",
  priority: 0.8,
}
```

### Common SEO Issues & Fixes

#### Issue: Duplicate Content
**Fix**: Add canonical URLs
```javascript
alternates: {
  canonical: "https://bestbuyersview.com/preferred-url",
}
```

#### Issue: Missing Meta Description
**Fix**: Add description to metadata
```javascript
description: "Your unique page description here"
```

#### Issue: Slow Page Load
**Fix**: 
1. Enable ISR: `export const revalidate = 3600;`
2. Use `next/image` for images
3. Implement lazy loading

#### Issue: Missing Structured Data
**Fix**: Use appropriate schema component from `/components/seo/`

## 📋 Schema Component Quick Reference

| Component | Use Case | Import Path |
|-----------|----------|-------------|
| OrganizationSchema | Homepage | `@/components/seo/OrganizationSchema` |
| WebsiteSchema | Homepage | `@/components/seo/WebsiteSchema` |
| ProductStructuredData | Product pages | `@/components/seo/ProductStructuredData` |
| CategoryStructuredData | Category pages | `@/components/seo/CategoryStructuredData` |
| ArticleStructuredData | Blog posts | `@/components/seo/ArticleStructuredData` |
| BreadcrumbSchema | All pages | `@/components/seo/BreadcrumbSchema` |
| FAQSchema | FAQ sections | `@/components/seo/FAQSchema` |

## 🔍 Testing Commands

```bash
# Run local development
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Test with Lighthouse
npx lighthouse https://bestbuyersview.com --view
```

## 📊 Priority Guidelines

- **1.0**: Homepage only
- **0.9-0.95**: Main listing pages (categories, blog)
- **0.8-0.85**: Important category pages
- **0.7-0.75**: Product/blog post pages
- **0.5-0.6**: About, contact pages
- **0.3-0.4**: Legal pages (privacy, terms)

## ⏱️ Revalidation Guidelines

- **Static**: No revalidate (never changes)
- **3600 (1 hour)**: Blog posts, news
- **1800 (30 min)**: Products, categories
- **600 (10 min)**: Frequently updated content
- **60 (1 min)**: Real-time data

## 🎯 Keyword Research Tips

1. Use Google Keyword Planner
2. Check competitor titles
3. Focus on long-tail keywords
4. Include location if relevant
5. Add year for evergreen content
6. Use "best", "top", "review" for product pages

## ✅ Pre-Deployment Checklist

- [ ] All new pages have metadata
- [ ] Unique titles and descriptions
- [ ] Canonical URLs set
- [ ] Structured data added
- [ ] Images have alt text
- [ ] Links tested (no 404s)
- [ ] Mobile responsive
- [ ] Sitemap includes new pages
- [ ] Lighthouse score > 90
- [ ] No console errors

## 🚨 Emergency Fixes

### Google Not Indexing Pages
1. Check robots.txt isn't blocking
2. Submit URL in Search Console
3. Check for `noindex` tags
4. Verify sitemap includes URL
5. Check for crawl errors

### Broken Structured Data
1. Test with Rich Results Test
2. Check JSON-LD syntax
3. Validate all required properties
4. Remove undefined values
5. Test in Schema.org validator

### Poor Page Speed
1. Enable compression in next.config
2. Optimize images (use next/image)
3. Enable ISR for dynamic pages
4. Remove unused dependencies
5. Check API response times

---

**Need more help?** See [SEO-COMPLETE-GUIDE.md](./SEO-COMPLETE-GUIDE.md)
