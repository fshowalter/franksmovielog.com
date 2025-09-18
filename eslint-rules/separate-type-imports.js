/**
 * ESLint rule to enforce separate type imports
 * Splits mixed imports like `import { type Foo, bar }` into:
 * - `import type { Foo }`
 * - `import { bar }`
 */
/**
 * Build named imports part with proper comma placement
 */
function buildNamedImportsPart(namedImports, hasPrevious) {
  if (namedImports.length === 0) {
    return "";
  }
  const namedImportStr = namedImports
    .map((spec) => buildNamedSpecifier(spec))
    .join(", ");
  return hasPrevious ? `, { ${namedImportStr} }` : `{ ${namedImportStr} }`;
}

/**
 * Build import string for a named specifier
 */
function buildNamedSpecifier(spec) {
  const imported = spec.imported;
  const local = spec.local;
  if (imported.name === local.name) {
    return imported.name;
  }
  return `${imported.name} as ${local.name}`;
}
/**
 * Build namespace import part with proper comma placement
 */
function buildNamespaceImportPart(namespaceImports, hasDefault) {
  if (namespaceImports.length === 0) {
    return "";
  }
  const namespaceStr = `* as ${namespaceImports[0].local.name}`;
  return hasDefault ? `, ${namespaceStr}` : namespaceStr;
}
/**
 * Safely format the import source string
 */
function formatImportSource(source) {
  // If source.raw exists and is a string, use it directly
  if (typeof source.raw === "string") {
    return source.raw;
  }
  // Otherwise, wrap source.value in quotes
  if (typeof source.value === "string") {
    // Check if it already has quotes
    if (source.value.startsWith('"') || source.value.startsWith("'")) {
      return source.value;
    }
    return `"${source.value}"`;
  }
  // Fallback - shouldn't happen in practice
  return `"${String(source.value)}"`;
}
const rule = {
  create(context) {
    return {
      ImportDeclaration(node) {
        const importNode = node;
        // Skip if it's already a type-only import
        if (importNode.importKind === "type") {
          return;
        }
        // Check if there are mixed type and value specifiers
        const typeSpecifiers = [];
        const valueSpecifiers = [];
        for (const specifier of importNode.specifiers) {
          if (specifier.type === "ImportSpecifier") {
            const importSpec = specifier;
            if (importSpec.importKind === "type") {
              typeSpecifiers.push(importSpec);
            } else {
              valueSpecifiers.push(importSpec);
            }
          } else {
            // ImportDefaultSpecifier or ImportNamespaceSpecifier
            valueSpecifiers.push(specifier);
          }
        }
        // If we have both type and value specifiers, report and fix
        if (typeSpecifiers.length > 0 && valueSpecifiers.length > 0) {
          context.report({
            fix(fixer) {
              const fixes = [];
              const sourceStr = formatImportSource(importNode.source);
              // Build the type import statement
              const typeImports = typeSpecifiers
                .map((spec) => buildNamedSpecifier(spec))
                .join(", ");
              const typeImportStatement = `import type { ${typeImports} } from ${sourceStr};`;
              // Build the value import statement
              let valueImportStatement = "";
              if (valueSpecifiers.length > 0) {
                // Handle default imports separately
                const defaultImports = valueSpecifiers.filter(
                  (s) => s.type === "ImportDefaultSpecifier",
                );
                const namespaceImports = valueSpecifiers.filter(
                  (s) => s.type === "ImportNamespaceSpecifier",
                );
                const namedImports = valueSpecifiers.filter(
                  (s) => s.type === "ImportSpecifier",
                );
                const importParts = [];
                // Add default import
                if (defaultImports.length > 0) {
                  importParts.push(defaultImports[0].local.name);
                }
                // Add namespace import with proper comma
                const namespaceImportPart = buildNamespaceImportPart(
                  namespaceImports,
                  defaultImports.length > 0,
                );
                if (namespaceImportPart) {
                  importParts.push(namespaceImportPart);
                }
                // Add named imports with proper comma
                const namedImportsPart = buildNamedImportsPart(
                  namedImports,
                  defaultImports.length > 0 || namespaceImports.length > 0,
                );
                if (namedImportsPart) {
                  importParts.push(namedImportsPart);
                }
                valueImportStatement = `import ${importParts.join("")} from ${sourceStr};`;
              }
              // Replace the original import with both statements
              const replacement =
                valueSpecifiers.length > 0
                  ? `${typeImportStatement}\n${valueImportStatement}`
                  : typeImportStatement;
              fixes.push(fixer.replaceText(importNode, replacement));
              return fixes;
            },
            messageId: "separateTypeImports",
            node: importNode,
          });
        }
      },
    };
  },
  meta: {
    docs: {
      category: "Style",
      description: "Enforce separate type imports",
      recommended: false,
    },
    fixable: "code",
    messages: {
      separateTypeImports:
        "Type imports should be in a separate import type declaration",
    },
    schema: [],
    type: "suggestion",
  },
};
export default rule;
