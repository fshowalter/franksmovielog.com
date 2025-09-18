/**
 * Normalizes script src paths in HTML for testing.
 * @param result - HTML string containing script tags
 * @returns HTML with normalized script src paths
 */
export function normalizeScriptSrc(result: string) {
  return result.replaceAll(
    /(src=")(.*)(\/src\/astro\/AstroPageShell\.astro\?astro&type=script&index=\d+&lang\.ts")/g,
    "$1$3",
  );
}
