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
 * Create a product slug from title and ID
 * Example: "Best Drafting Table", "123abc" -> "Best-Drafting-Table-123abc"
 * @param {string} title - The product title
 * @param {string} id - The product ID
 * @returns {string} - The slugified product URL
 */
export function createProductSlug(title, id) {
  if (!title || !id) return id || '';
  const cleanTitle = title
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
  return `${cleanTitle}-${id}`;
}

/**
 * Extract product ID from a product slug
 * Example: "Best-Drafting-Table-123abc" -> "123abc"
 * @param {string} slug - The product slug
 * @returns {string} - The product ID
 */
export function extractProductId(slug) {
  if (!slug) return '';
  // The ID is the last segment after the final hyphen
  // Assuming MongoDB IDs are 24 characters (or adjust as needed)
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  // If the last part looks like a MongoDB ID (24 chars alphanumeric), return it
  if (lastPart && lastPart.length === 24) {
    return lastPart;
  }
  // Otherwise, return the whole slug (fallback for direct IDs)
  return slug;
}
