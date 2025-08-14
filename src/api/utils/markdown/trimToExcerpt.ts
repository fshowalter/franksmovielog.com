import type { Root } from "mdast";

export function trimToExcerpt() {
  return (tree: Root) => {
    // Find first paragraph more efficiently
    for (let i = 0; i < tree.children.length; i++) {
      if (tree.children[i].type === "paragraph") {
        // Keep only up to and including the first paragraph
        tree.children.length = i + 1;
        break;
      }
    }
  };
}
