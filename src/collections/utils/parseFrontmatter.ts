import yaml from "js-yaml";

// Capture frontmatter wrapped with `---`, including any characters and new lines within it.
// Only capture if `---` or exists near the top of the file, including:
// 1. Start of file (including if has BOM encoding)
// 2. Start of file with any whitespace (but `---` or `+++` must still start on a new line)
const frontmatterRE = /(?:^\uFEFF?|^\s*\n)(?:---)([\s\S]*?\n)(?:---)/;

export function parseFrontmatter(
  fileContent: string,
  filePath: string,
): {
  body: string;
  frontmatter: Record<string, unknown>;
} {
  const rawFrontmatter = extractFrontmatter(fileContent);

  if (!rawFrontmatter) {
    throw new Error(`Frontmatter not found in ${filePath}`);
  }

  const parsedFrontmatter = yaml.load(rawFrontmatter) as Record<
    string,
    unknown
  >;

  return {
    body: fileContent.replace(`---${rawFrontmatter}---`, ""),
    frontmatter: parsedFrontmatter,
  };
}

function extractFrontmatter(fileContent: string): string | undefined {
  return frontmatterRE.exec(fileContent)?.[1];
}
