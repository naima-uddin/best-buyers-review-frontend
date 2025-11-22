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
