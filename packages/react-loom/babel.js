// babel.js
// Babel preset helper for React Loom

module.exports = function babelPresetReactLoom() {
  return {
    presets: [],
    plugins: [require.resolve('babel-plugin-react-loom')]
  };
};
