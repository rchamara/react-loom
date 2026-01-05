// isReactive.js

/**
 * Determines whether a variable name should be treated as a reactive global.
 * Reactive globals must start with '__'.
 * @param {string} name - The variable name
 * @returns {boolean}
 */
export function isReactiveName(name) {
  return typeof name === 'string' && name.startsWith('__');
}