import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),     
      '@classes': path.resolve(__dirname, 'src/classes'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@services': path.resolve(__dirname, 'src/services'),
      // '@supabase': path.resolve(__dirname, 'src/supabase'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
})
