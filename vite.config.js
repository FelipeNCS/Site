import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  build: {
    lib: {
      entry: 'main.jsx',
      name: 'HoloCart',
      fileName: 'bundle',
      formats: ['iife']
    },
    rollupOptions: {
      external: []
    }
  }
})
