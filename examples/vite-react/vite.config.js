import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [require.resolve('babel-plugin-react-loom')]
      }
    })
  ]
});
