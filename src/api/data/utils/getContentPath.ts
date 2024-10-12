import path from "node:path";

export function getContentPath(
  kind: "data" | "pages" | "reviews" | "viewings",
  subPath?: string,
) {
  if (subPath) {
    return path.join(process.cwd(), "content", kind, subPath);
  }

  return path.join(process.cwd(), "content", kind);
}
