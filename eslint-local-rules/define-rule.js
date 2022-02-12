const functionTypes = [
  "ArrowFunctionExpression",
  "FunctionDeclaration",
  "FunctionExpression",
  "MethodDefinition",
];
const importTypes = [
  "ImportDeclaration",
  "ExportNamedDeclaration",
  "ExportDefaultDeclaration",
];
const typeDeclaration = ["TSTypeAliasDeclaration", "TSTypeReference"];

/**
 * THis method finds all the identifiers that are executed synchronously in the module.
 * This means when require('./module'), it is executing the code with that identifer.
 *
 * If the identifier is part of declarator/import/export, then its not
 * really a concern. If its inside a function, then its not being executed when imported.
 *
 */
const isUsedSynchronously = (node) => {
  // If this identifer is just a declarator, then its ok
  // let _truebillPremiumServiceId: PKey<Service> | null = null;
  //     ^^^^^^^^^^^^^^^^^^^^^^^^^
  if (node.parent.type === "VariableDeclarator" && node.parent.id === node) {
    return false;
  }

  // If this identifer is just a declarator, then its ok
  // class PayAdvanceTicketClass extends BaseTicket<PayAdvanceState, PayAdvanceAction> {
  //       ^^^^^^^^^^^^^^^^^^^^^
  if (node.parent.type === "ClassDeclaration" && node.parent.id === node) {
    return false;
  }

  // class PostgresTransactionRepository implements TransactionRepository {
  //   attachToSubscription = attachToSubscription;
  //                          ^^^^^^^^^^^^^^^^^^^^
  // }
  if (["ClassProperty"].includes(node.parent.type)) {
    return false;
  }

  const wasUsedAsSuperClass =
    node.parent.type === "ClassDeclaration" && node.parent.superClass === node;

  // This is the common case.
  let c = node.parent;
  while (c) {
    // babel strips all types out, we can ignore these.
    // type FooBar = Foo & Bar
    //               ^^^   ^^^
    if (typeDeclaration.includes(c.type)) {
      return false;
    }

    // If it is an identifer in an import or export, ignore. Exept when a imported identifier is used as a class superType
    // import Foo from './path/to/foo';
    //        ^^^
    if (!wasUsedAsSuperClass && importTypes.includes(c.type)) {
      return false;
    }

    // If its inside a function definition, ignore
    // const myFunc = () => myVar * 2;
    //                      ^^^^^
    if (functionTypes.includes(c.type)) {
      return false;
    }

    c = c.parent;
  }

  return true;
};

/**
 * This method determines if a variable is from another source module. It omits
 * any variables from node_modules, because it is impossible to have a circular
 * dependency with a node module.
 */
const isIdentifierFromAnotherSourceFile = (context, variableName) => {
  const filename = context.getFilename();
  const curPath = dirname(filename);

  // Find identifier in the scope (return false if undefined)
  let variable;
  let scope = context.getScope();

  do {
    variable = scope.variables.find((v) => v.name === variableName);
    scope = scope.upper;
  } while (!variable && scope);

  if (!variable) {
    return false;
  }

  // See if if its from an import.
  const foundOffendingImport = variable.defs.find(
    (def) =>
      def.parent &&
      def.parent.type === "ImportDeclaration" &&
      !isNodeModule(curPath, def.parent.source.value)
  );

  return foundOffendingImport &&
    foundOffendingImport.parent &&
    foundOffendingImport.parent.source &&
    foundOffendingImport.parent.source.value
    ? foundOffendingImport.parent.source.value
    : null;
};

module.exports = {
  create(context) {
    const filename = context.getFilename();
    const isInParseDir = filename.match(/\/parse/);

    if (!isInParseDir) {
      return {};
    }

    return {
      Identifier: (node) => {
        if (!isUsedSynchronously(node)) {
          return;
        }
        const offendingImport = isIdentifierFromAnotherSourceFile(
          context,
          node.name
        );
        if (offendingImport && node.name !== "defineRule") {
          const message = `This may cause a circular dependency error, wrap it inside defineRule. Use defineRule(() => ...)`;
          context.report({
            node,
            message,
          });
        }
      },
    };
  },
};
