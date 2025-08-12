import type { JSX } from "react";

/**
 * Serialize a JSX element to a stable string representation for hashing.
 * This captures the component structure, props, and children.
 */
export function serializeJsx(element: JSX.Element | null | undefined): string {
  if (element == undefined) {
    return "null";
  }

  // Handle primitive values (strings, numbers, booleans)
  if (typeof element !== "object") {
    return JSON.stringify(element);
  }

  // Handle arrays
  if (Array.isArray(element)) {
    return `[${element.map(serializeJsx).join(",")}]`;
  }

  // Handle React elements
  if (element.$$typeof) {
    const type =
      typeof element.type === "function"
        ? element.type.name || "Anonymous"
        : String(element.type);

    const props: Record<string, any> = {};

    // Process props, excluding children
    if (element.props) {
      for (const [key, value] of Object.entries(element.props)) {
        if (key === "children") continue;

        // Serialize prop values
        if (value === null || value === undefined) {
          props[key] = "null";
        } else if (typeof value === "function") {
          // For functions, use their name or a placeholder
          props[key] = `[Function:${value.name || "anonymous"}]`;
        } else if (typeof value === "object") {
          // For objects and arrays, serialize recursively
          props[key] = JSON.stringify(value);
        } else {
          // Primitives
          props[key] = value;
        }
      }
    }

    // Sort props for deterministic output
    const sortedPropsStr = JSON.stringify(props, Object.keys(props).sort());

    // Serialize children
    const children = element.props?.children;
    const childrenStr = children ? serializeJsx(children) : "";

    // Combine into a stable string representation
    return `<${type}:${sortedPropsStr}>${childrenStr}</${type}>`;
  }

  // Fallback for other objects
  try {
    return JSON.stringify(element);
  } catch {
    return "[Object]";
  }
}
