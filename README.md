# React Loom

React Loom is a **compiler-first reactive globals system for React**. It allows developers to declare **top-level variables** as reactive globals and automatically track dependencies across components — all **without hooks, context, or boilerplate**.

---

## Features

- Plain JavaScript globals, e.g., `let __count = 0`
- Automatic reactivity in JSX and JS code
- Cross-file global sharing
- Targeted component re-rendering
- Compatible with CRA, Vite, or any React setup using Babel
- SSR-safe read access

---

## Installation

```bash
# Using npm
npm install react-loom react-loom-runtime babel-plugin-react-loom --save

# Using yarn
yarn add react-loom react-loom-runtime babel-plugin-react-loom
```

---

## Babel Setup

### Standalone plugin

```js
// babel.config.js
module.exports = {
  presets: ['@babel/preset-react'],
  plugins: [require.resolve('babel-plugin-react-loom')]
};
```

### Using preset helper

```js
// babel.config.js
module.exports = {
  presets: [require.resolve('react-loom/babel')]
};
```

---

## Usage

### Declare reactive globals

```js
// globals.js
let __count = 0;
let __message = 'Hello';
```

### Use in components

```jsx
function App() {
  return (
    <div>
      <h1>{__message}</h1>
      <p>Count: {__count}</p>
      <button onClick={() => __count++}>Increment</button>
    </div>
  );
}
```

### Cross-file sharing

```js
// AnotherComponent.jsx
export default function Another() {
  return <div>Count from other file: {__count}</div>;
}
```

No imports, hooks, or boilerplate needed.

---

## Examples

- `examples/basic-react/` → CRA-style setup
- `examples/vite-react/` → Vite + React setup

Start dev server in example:

```bash
cd examples/basic-react
npm install
npm run start
```

```bash
cd examples/vite-react
npm install
npm run dev
```

---

## Advanced / Internal

- Babel plugin transforms top-level `__*` variables into reactive reads/writes
- Tracks which components use which globals
- Injects runtime subscriptions automatically
- Runtime provides store, subscriptions, and React force-update logic
- SSR support with `ssr.js` (read-only, no subscriptions)

---

## Limitations

- Only works with **top-level variables** starting with `__`
- No array/object deep reactivity yet
- Subscription granularity is per-component
- SSR hydration needs future enhancement

---

## License

MIT

