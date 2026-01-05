// names.js
// Utility for naming conventions and unique identifiers

let uidCounter = 0;

export function generateUid(prefix = '__loom') {
  uidCounter += 1;
  return `${prefix}${uidCounter}`;
}
