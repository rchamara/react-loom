import { isReactiveName } from "../utils/isReactive";

export default {
  finalizeProgram(programPath, state, babel) {
    const t = babel.types;
    const deps = state.reactLoom.componentDeps;

    if (!deps || deps.size === 0) return;

    // Inject runtime import once per file
    let hasImport = false;
    programPath.traverse({
      ImportDeclaration(path) {
        if (path.node.source.value === "react-loom-runtime") {
          hasImport = true;
          path.stop();
        }
      },
    });

    if (!hasImport) {
      const importDecl = t.importDeclaration(
        [
          t.importSpecifier(t.identifier("__rg_subscribe"), t.identifier("__rg_subscribe")),
          t.importSpecifier(t.identifier("__rg_unsubscribe"), t.identifier("__rg_unsubscribe")),
          t.importSpecifier(t.identifier("__rg_forceUpdate"), t.identifier("__rg_forceUpdate")),
        ],
        t.stringLiteral("react-loom-runtime")
      );
      programPath.unshiftContainer("body", importDecl);
    }

    // Wrap components
    programPath.traverse({
      FunctionDeclaration(path) {
        const name = path.node.id && path.node.id.name;
        if (!deps.has(name)) return;

        const usedGlobals = Array.from(deps.get(name));
        const body = path.get("body");

        // inject subscription logic
        body.unshiftContainer(
          "body",
          t.expressionStatement(
            t.callExpression(t.identifier("__rg_subscribe"), [
              t.stringLiteral(name),
              t.arrayExpression(usedGlobals.map(g => t.stringLiteral(g))),
            ])
          )
        );

        body.pushContainer(
          "body",
          t.expressionStatement(
            t.callExpression(t.identifier("__rg_unsubscribe"), [
              t.stringLiteral(name),
            ])
          )
        );
      },
    });
  },
};
