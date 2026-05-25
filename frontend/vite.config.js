import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Polyfill bare globals expected by some blockchain/wallet libraries
  // These are sometimes injected as raw identifiers (not import.meta.env)
  define: {
    'SBT_CONTRACT_URL':       JSON.stringify(''),
    'global':                 'globalThis',
    'process.env':            '{}',
  },

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // Do NOT rewrite — backend already has /api prefix on all routes
      },
    },
  },
})

