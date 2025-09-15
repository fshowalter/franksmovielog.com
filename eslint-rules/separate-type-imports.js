/**
 * ESLint rule to enforce separate type imports
 * Splits mixed imports like `import { type Foo, bar }` into:
 * - `import type { Foo }`
 * - `import { bar }`
 */

export default {
  create(context) {
    return {
      ImportDeclaration(node) {
        // Skip if it's already a type-only import
        if (node.importKind === 'type') {
          return;
        }

        // Check if there are mixed type and value specifiers
        const typeSpecifiers = [];
        const valueSpecifiers = [];

        for (const specifier of node.specifiers) {
          if (specifier.type === 'ImportSpecifier') {
            if (specifier.importKind === 'type') {
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
              const typeImports = typeSpecifiers.map(spec => {
                if (spec.imported.name === spec.local.name) {
                  return spec.imported.name;
                }
                return `${spec.imported.name} as ${spec.local.name}`;
              }).join(', ');

              const typeImportStatement = `import type { ${typeImports} } from ${source};`;

              // Build the value import statement
              let valueImportStatement = '';

              if (valueSpecifiers.length > 0) {
                valueSpecifiers.map(spec => {
                  if (spec.type === 'ImportDefaultSpecifier') {
                    return spec.local.name;
                  }
                  if (spec.type === 'ImportNamespaceSpecifier') {
                    return `* as ${spec.local.name}`;
                  }
                  // ImportSpecifier
                  if (spec.imported.name === spec.local.name) {
                    return spec.imported.name;
                  }
                  return `${spec.imported.name} as ${spec.local.name}`;
                });

                // Handle default imports separately
                const defaultImports = valueSpecifiers.filter(s => s.type === 'ImportDefaultSpecifier');
                const namespaceImports = valueSpecifiers.filter(s => s.type === 'ImportNamespaceSpecifier');
                const namedImports = valueSpecifiers.filter(s => s.type === 'ImportSpecifier');

                let importParts = [];

                if (defaultImports.length > 0) {
                  importParts.push(defaultImports[0].local.name);
                }

                if (namespaceImports.length > 0) {
                  if (importParts.length === 0) {
                    importParts.push(`* as ${namespaceImports[0].local.name}`);
                  } else {
                    importParts.push(`, * as ${namespaceImports[0].local.name}`);
                  }
                }

                if (namedImports.length > 0) {
                  const namedImportStr = namedImports.map(spec => {
                    if (spec.imported.name === spec.local.name) {
                      return spec.imported.name;
                    }
                    return `${spec.imported.name} as ${spec.local.name}`;
                  }).join(', ');

                  if (defaultImports.length > 0 || namespaceImports.length > 0) {
                    importParts.push(`, { ${namedImportStr} }`);
                  } else {
                    importParts.push(`{ ${namedImportStr} }`);
                  }
                }

                valueImportStatement = `import ${importParts.join('')} from ${source};`;
              }

              // Replace the original import with both statements
              const replacement = valueSpecifiers.length > 0
                ? `${typeImportStatement}\n${valueImportStatement}`
                : typeImportStatement;

              fixes.push(fixer.replaceText(node, replacement));

              return fixes;
            },
            messageId: 'separateTypeImports',
            node,
          });
        }
      },
    };
  },

  meta: {
    docs: {
      category: 'Style',
      description: 'Enforce separate type imports',
      recommended: false,
    },
    fixable: 'code',
    messages: {
      separateTypeImports: 'Type imports should be in a separate import type declaration',
    },
    schema: [],
    type: 'suggestion',
  },
};