import globalsVisitor from "./visitors/globals";
import jsxTrackingVisitor from "./visitors/jsxTracking";
import componentsVisitor from "./visitors/components";

export default function reactLoomBabelPlugin(babel) {
  return {
    name: "react-loom",
    pre() {
      this.reactLoom = {
        globals: new Set(),
        componentDeps: new Map(),
      };
    },
    visitor: {
      Program: {
        enter(path, state) {
          state.reactLoom = state.reactLoom || state.file.reactLoom;
        },
        exit(path, state) {
          componentsVisitor.finalizeProgram(path, state, babel);
        },
      },
      ...globalsVisitor(babel),
      ...jsxTrackingVisitor(babel),
    },
  };
}
