export function normalizeScriptSrc(result: string) {
  return result.replaceAll(
    /(src=")(.*)(\/src\/astro\/AstroPageShell\.astro\?astro&type=script&index=\d+&lang\.ts")/g,
    "$1$3",
  );
}
