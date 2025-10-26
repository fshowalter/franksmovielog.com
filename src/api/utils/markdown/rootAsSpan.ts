import type { Root as HastRoot } from "hast";

/**
 * Rehype plugin that converts the first element to a span.
 * @returns Transformer function for the AST
 */
export function rootAsSpan() {
  return pluginFunction;
}

function pluginFunction(tree: HastRoot) {
  const firstChild = tree.children[0];

  if (firstChild && firstChild.type === "element") {
    firstChild.tagName = "span";
  }
}
