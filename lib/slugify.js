/**
 * Convert a category name to a URL-friendly slug
 * Example: "Drafting Tables" -> "Drafting-Tables"
 * @param {string} text - The text to slugify
 * @returns {string} - The slugified text
 */
export function slugify(text) {
  if (!text) return '';
  return text
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens
}

/**
 * Convert a URL slug back to the original format
 * Example: "Drafting-Tables" -> "Drafting Tables"
 * @param {string} slug - The slug to convert
 * @returns {string} - The original text
 */
export function unslugify(slug) {
  if (!slug) return '';
  return slug
    .replace(/-/g, ' '); // Replace hyphens with spaces
}

/**
 * Create a product slug from title (no ID)
 * Example: "Best Drafting Table" -> "Best-Drafting-Table"
 * @param {string} title - The product title
 * @param {string} id - The product ID (ignored, kept for compatibility)
 * @returns {string} - The slugified product URL
 */
export function createProductSlug(title, id) {
  if (!title) return '';
  const cleanTitle = title
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .toLowerCase(); // Convert to lowercase for consistency
  return cleanTitle;
}

/**
 * Extract product slug (returns the slug as-is since we removed IDs)
 * Example: "Best-Drafting-Table" -> "Best-Drafting-Table"
 * @param {string} slug - The product slug
 * @returns {string} - The product slug
 */
export function extractProductId(slug) {
  if (!slug) return '';
  return slug;
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
