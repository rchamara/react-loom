import React from 'react';

export default function App() {
  return (
    <div>
      <h1>{__message}</h1>
      <p>Count: {__count}</p>
      <button onClick={() => __count++}>Increment</button>
    </div>
  );
}
