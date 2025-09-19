const regex = new RegExp(/(\/_image\/\?href=%2F)(.*?)(?=content)/gm);

/**
 * Normalizes image source paths for testing.
 * @param sources - HTML string containing image sources
 * @returns Normalized HTML string
 */
export function normalizeSources(sources: string): string {
  if (import.meta.env.MODE === "test") {
    return sources.replaceAll(regex, "$1");
  }
  return sources;
}
