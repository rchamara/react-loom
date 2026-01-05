// React Loom SSR support (safe no-op by default)
//
// Goals:
// - Allow reading reactive globals during SSR without accessing window
// - Avoid subscriptions or side effects on the server
// - Enable optional state extraction & hydration later

import { get } from "./store";

// Detect server environment
export const isServer = typeof window === "undefined";

// Server-safe getter
export function __rg_get_ssr(name) {
  return get(name);
}

// No-op subscription helpers for SSR
export function __rg_subscribe_ssr() {}
export function __rg_unsubscribe_ssr() {}

// Optional: extract snapshot for hydration
export function __rg_snapshot() {
  return {};
}
