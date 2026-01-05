import { isReactiveName } from "../utils/isReactive";

export default function jsxTrackingVisitor(babel) {
  const t = babel.types;

  function getCurrentComponent(path) {
    return path.findParent(p => p.isFunctionDeclaration() || p.isArrowFunctionExpression());
  }

  return {
    JSXExpressionContainer(path, state) {
      const expr = path.get("expression");
      if (!expr.isIdentifier()) return;

      const name = expr.node.name;
      if (!isReactiveName(name)) return;

      const componentPath = getCurrentComponent(path);
      if (!componentPath) return;

      const componentId = componentPath.node.id
        ? componentPath.node.id.name
        : "anonymous";

      if (!state.reactLoom.componentDeps.has(componentId)) {
        state.reactLoom.componentDeps.set(componentId, new Set());
      }

      state.reactLoom.componentDeps.get(componentId).add(name);

      expr.replaceWith(
        t.callExpression(t.identifier("__rg_get"), [t.stringLiteral(name)])
      );
    },

    Identifier(path) {
      if (!path.isReferencedIdentifier()) return;
      const name = path.node.name;
      if (!isReactiveName(name)) return;

      if (path.parentPath.isJSXExpressionContainer()) return;

      path.replaceWith(
        t.callExpression(t.identifier("__rg_get"), [t.stringLiteral(name)])
      );
    },
  };
}
