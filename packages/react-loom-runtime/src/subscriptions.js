// React-specific subscription wiring for React Loom

import React from "react";

// Global map: componentId -> forceUpdate fn
if (!window.__REACT_LOOM_UPDATERS__) {
  window.__REACT_LOOM_UPDATERS__ = new Map();
}

export function __rg_forceUpdate(componentId) {
  const updater = window.__REACT_LOOM_UPDATERS__.get(componentId);
  if (updater) updater();
}

export function __rg_register(componentId) {
  // Simple forceUpdate using React state
  let force;

  function LoomUpdater() {
    const [, setTick] = React.useState(0);
    force = () => setTick(t => t + 1);
    return null;
  }

  // Register updater
  window.__REACT_LOOM_UPDATERS__.set(componentId, () => force && force());

  return LoomUpdater;
}

export function __rg_unregister(componentId) {
  window.__REACT_LOOM_UPDATERS__.delete(componentId);
}
