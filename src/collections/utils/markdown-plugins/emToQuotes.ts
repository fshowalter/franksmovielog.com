import type { Literal, Node, Parent } from "unist";

import { CONTINUE, visit } from "unist-util-visit";

/**
 * Remark plugin to convert emphasis (em) tags to quoted text.
 * @returns Transformer function for the syntax tree
 */
export function emToQuotes() {
  return pluginFunction;
}

function pluginFunction(tree: Node) {
  visit(
    tree,
    "emphasis",
    function (node: Parent, index: number, parent: Parent) {
      if (!node.children || node.children.length === 0) {
        return CONTINUE;
      }

      const firstChild = node.children[0] as Literal;
      if (firstChild && typeof firstChild.value === "string") {
        // Create new text node with quotes instead of modifying in place
        const textNode: Literal = {
          type: "text",
          value: `"${firstChild.value}"`,
        };
        parent.children[index] = textNode;
      }

      return CONTINUE;
    },
  );

  return tree;
}
