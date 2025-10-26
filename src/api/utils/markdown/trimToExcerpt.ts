import type { Root } from "mdast";

/**
 * Remark plugin to trim content to just the first paragraph.
 * @returns Transformer function for the syntax tree
 */
export function trimToExcerpt() {
  return pluginFunction;
}

function pluginFunction(tree: Root) {
  // Find first paragraph more efficiently
  for (let i = 0; i < tree.children.length; i++) {
    if (tree.children[i].type === "paragraph") {
      // Keep only up to and including the first paragraph
      tree.children.length = i + 1;
      break;
    }
  }
}
