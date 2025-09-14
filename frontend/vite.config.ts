import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['process'],
      globals: {
        process: true,
        global: true,
      },
    }),
  ],
  define: {
    global: 'globalThis',
    'process.env': 'import.meta.env',
    'process.env.NODE_ENV': '"development"',
  },
  server: {
    port: 5173,
  },
})
