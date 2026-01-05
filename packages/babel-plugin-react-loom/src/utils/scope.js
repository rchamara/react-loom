// scope.js
// Helper for scope-related checks (placeholder, extendable)

export function isTopLevel(path) {
  return path.parent.type === 'Program';
}

export function isDeclaredInScope(path, name) {
  return path.scope.hasBinding(name);
}
