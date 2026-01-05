import { isReactiveName } from "../utils/isReactive";

export default function globalsVisitor(babel) {
  const t = babel.types;

  function ensureRuntimeImport(path, state) {
    const program = path.findParent(p => p.isProgram());
    if (state.__loomRuntimeImported) return;

    const importDecl = t.importDeclaration([
      t.importSpecifier(t.identifier("__rg_get"), t.identifier("get")),
      t.importSpecifier(t.identifier("__rg_set"), t.identifier("set")),
      t.importSpecifier(t.identifier("__rg_define"), t.identifier("define")),
    ], t.stringLiteral("react-loom-runtime"));

    program.unshiftContainer("body", importDecl);
    state.__loomRuntimeImported = true;
  }

  return {
    VariableDeclaration(path, state) {
      if (path.parent.type !== "Program") return;

      for (const decl of path.node.declarations) {
        if (!t.isIdentifier(decl.id)) continue;
        const name = decl.id.name;
        if (!isReactiveName(name)) continue;

        ensureRuntimeImport(path, state);
        state.reactLoom.globals.add(name);

        const init = decl.init || t.identifier("undefined");

        const defineCall = t.expressionStatement(
          t.callExpression(t.identifier("__rg_define"), [
            t.stringLiteral(name),
            init,
          ])
        );

        path.insertAfter(defineCall);
      }
    },

    AssignmentExpression(path, state) {
      const left = path.node.left;
      if (!t.isIdentifier(left)) return;
      const name = left.name;
      if (!isReactiveName(name)) return;

      ensureRuntimeImport(path, state);

      path.replaceWith(
        t.callExpression(t.identifier("__rg_set"), [
          t.stringLiteral(name),
          path.node.right,
        ])
      );
    },

    UpdateExpression(path, state) {
      const arg = path.node.argument;
      if (!t.isIdentifier(arg)) return;
      const name = arg.name;
      if (!isReactiveName(name)) return;

      ensureRuntimeImport(path, state);

      const one = t.numericLiteral(1);
      const op = path.node.operator === "++" ? "+" : "-";

      path.replaceWith(
        t.callExpression(t.identifier("__rg_set"), [
          t.stringLiteral(name),
          t.binaryExpression(op, t.callExpression(t.identifier("__rg_get"), [t.stringLiteral(name)]), one),
        ])
      );
    },

    Identifier(path, state) {
      if (!isReactiveName(path.node.name)) return;
      if (path.parentPath.isAssignmentExpression({ left: path.node })) return;
      if (path.parentPath.isUpdateExpression()) return;
      if (path.parentPath.isVariableDeclarator({ id: path.node })) return;

      ensureRuntimeImport(path, state);

      path.replaceWith(
        t.callExpression(t.identifier("__rg_get"), [
          t.stringLiteral(path.node.name),
        ])
      );
    },
  };
}
