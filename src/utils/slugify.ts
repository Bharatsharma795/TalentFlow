// ============================
// Function: slugify
// ============================
// Converts a string (usually a title) into a URL-friendly slug
export function slugify(title: string): string {
  return title
    .toLowerCase()              // Convert all characters to lowercase
    .trim()                     // Remove leading and trailing whitespace
    .replace(/[^\w\s-]/g, "")   // Remove all non-word characters except spaces and hyphens
    .replace(/\s+/g, "-");      // Replace one or more spaces with a single hyphen
}
