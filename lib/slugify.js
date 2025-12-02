/**
 * Convert a category name to a URL-friendly slug (lowercase)
 * Example: "Drafting Tables" -> "drafting-tables"
 * @param {string} text - The text to slugify
 * @returns {string} - The slugified text
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .trim()
    .replace(/&/g, 'and') // Replace & with 'and' for better SEO
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .toLowerCase(); // Convert to lowercase for SEO
}

/**
 * Convert a URL slug back to the original format (Title Case)
 * Example: "drafting-tables" -> "Drafting Tables"
 * @param {string} slug - The slug to convert
 * @returns {string} - The original text in Title Case
 */
export function unslugify(slug) {
  if (!slug) return '';
  return slug
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Create a product slug from title with ID
 * Example: "Best Drafting Table", "123" -> "best-drafting-table-123"
 * @param {string} title - The product title
 * @param {string} id - The product ID
 * @returns {string} - The slugified product URL with ID
 */
export function createProductSlug(title, id) {
  if (!title) return '';
  
  // Limit title to first 8 words for cleaner URLs
  const words = title.trim().split(/\s+/).slice(0, 8).join(' ');
  
  const cleanTitle = words
    .replace(/&/g, 'and') // Replace & with 'and' for better SEO
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .toLowerCase(); // Convert to lowercase for consistency
  
  // Append ID at the end for unique identification
  return id ? `${cleanTitle}-${id}` : cleanTitle;
}

/**
 * Extract product ID from slug
 * MongoDB ObjectIds are 24 hex characters
 * Example: "best-drafting-table-692d3f706ac129ed53bea05a" -> "692d3f706ac129ed53bea05a"
 * @param {string} slug - The product slug with ID
 * @returns {string} - The product ID
 */
export function extractProductId(slug) {
  if (!slug) return '';
  // MongoDB ObjectId is always last 24 characters
  // Match pattern: 24 hexadecimal characters at the end
  const match = slug.match(/([a-f0-9]{24})$/i);
  if (match) {
    return match[1];
  }
  // Fallback: return last segment after hyphen
  const parts = slug.split('-');
  return parts[parts.length - 1];
}

/**
 * Convert a product slug back to title format for matching
 * Example: "best-drafting-table" -> "Best Drafting Table"
 * @param {string} slug - The product slug
 * @returns {string} - The title
 */
export function slugToTitle(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
