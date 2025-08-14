import type { Node, Parent } from "mdast";

import { CONTINUE, visit } from "unist-util-visit";

export function removeFootnotes() {
  return (tree: Node) => {
    // Collect indices to remove in reverse order to avoid index shifting issues
    const toRemove: { index: number; parent: Parent }[] = [];

    visit(
      tree,
      "footnoteReference",
      function (
        node: Node,
        index: number | undefined,
        parent: Parent | undefined,
      ) {
        if (
          parent &&
          typeof index === "number" &&
          node.type === "footnoteReference"
        ) {
          toRemove.push({ index, parent });
        }
        return CONTINUE;
      },
    );

    // Remove in reverse order to avoid index shifting
    for (let i = toRemove.length - 1; i >= 0; i--) {
      const { index, parent } = toRemove[i];
      parent.children.splice(index, 1);
    }

    return tree;
  };
}
