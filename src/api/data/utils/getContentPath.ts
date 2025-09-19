import path from "node:path";

/**
 * Constructs a file path to content directory.
 * @param kind - Type of content (data, pages, reviews, or viewings)
 * @param subPath - Optional subdirectory or file path
 * @returns Absolute path to the content location
 */
export function getContentPath(
  kind: "data" | "pages" | "reviews" | "viewings",
  subPath?: string,
) {
  if (subPath) {
    return path.join(process.cwd(), "content", kind, subPath);
  }

  return path.join(process.cwd(), "content", kind);
}
