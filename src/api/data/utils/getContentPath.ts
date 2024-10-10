import { join } from "path";

export function getContentPath(
  kind: "data" | "pages" | "reviews" | "viewings",
  path?: string,
) {
  if (path) {
    return join(process.cwd(), "content", kind, path);
  }

  return join(process.cwd(), "content", kind);
}
