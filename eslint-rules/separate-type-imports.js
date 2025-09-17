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
  const namedImportStr = namedImports.map((spec) => buildNamedSpecifier(spec)).join(", ");
  return hasPrevious ? `, { ${namedImportStr} }` : `{ ${namedImportStr} }`;
}

/**
 * Build import string for a named specifier
 */
function buildNamedSpecifier(spec) {
  if (spec.imported.name === spec.local.name) {
    return spec.imported.name;
  }
  return `${spec.imported.name} as ${spec.local.name}`;
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

export default {
  create(context) {
    return {
      ImportDeclaration(node) {
        // Skip if it's already a type-only import
        if (node.importKind === "type") {
          return;
        }

        // Check if there are mixed type and value specifiers
        const typeSpecifiers = [];
        const valueSpecifiers = [];

        for (const specifier of node.specifiers) {
          if (specifier.type === "ImportSpecifier") {
            if (specifier.importKind === "type") {
              typeSpecifiers.push(specifier);
            } else {
              valueSpecifiers.push(specifier);
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
              const source = node.source.raw;

              // Build the type import statement
              const typeImports = typeSpecifiers
                .map((spec) => buildNamedSpecifier(spec))
                .join(", ");

              const typeImportStatement = `import type { ${typeImports} } from ${source};`;

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
                  defaultImports.length > 0
                );
                if (namespaceImportPart) {
                  importParts.push(namespaceImportPart);
                }

                // Add named imports with proper comma
                const namedImportsPart = buildNamedImportsPart(
                  namedImports,
                  defaultImports.length > 0 || namespaceImports.length > 0
                );
                if (namedImportsPart) {
                  importParts.push(namedImportsPart);
                }

                valueImportStatement = `import ${importParts.join("")} from ${source};`;
              }

              // Replace the original import with both statements
              const replacement =
                valueSpecifiers.length > 0
                  ? `${typeImportStatement}\n${valueImportStatement}`
                  : typeImportStatement;

              fixes.push(fixer.replaceText(node, replacement));

              return fixes;
            },
            messageId: "separateTypeImports",
            node,
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
