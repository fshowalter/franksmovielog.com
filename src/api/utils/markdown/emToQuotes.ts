import type { Literal, Node, Parent } from "unist";
import { CONTINUE, visit } from "unist-util-visit";

export function emToQuotes() {
  return (tree: Node) => {
    visit(
      tree,
      "emphasis",
      function (node: Parent, index: number, parent: Parent) {
        if (!node.children) {
          return CONTINUE;
        }

        const newNode = node.children[0] as Literal;
        newNode.value = `"${newNode.value as string}"`;
        parent.children.splice(index, 1, newNode);

        return CONTINUE;
      },
    );

    return tree;
  };
}
