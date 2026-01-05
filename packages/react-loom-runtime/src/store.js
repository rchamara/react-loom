// Global reactive store for React Loom

const store = new Map(); // name -> value
const listeners = new Map(); // name -> Set(componentId)

export function define(name, initialValue) {
  if (!store.has(name)) {
    store.set(name, initialValue);
    listeners.set(name, new Set());
  }
}

export function get(name) {
  return store.get(name);
}

export function set(name, value) {
  store.set(name, value);

  const subs = listeners.get(name);
  if (!subs) return;

  // Notify subscribed components
  subs.forEach(componentId => {
    const updater = window.__REACT_LOOM_UPDATERS__?.get(componentId);
    if (updater) updater();
  });
}

export function subscribe(componentId, globals) {
  globals.forEach(name => {
    if (!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name).add(componentId);
  });
}

export function unsubscribe(componentId) {
  listeners.forEach(set => set.delete(componentId));
}
