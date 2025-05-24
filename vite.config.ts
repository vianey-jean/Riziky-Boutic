
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@emoji-mart/data': path.resolve(__dirname, 'node_modules/@emoji-mart/data'),
      '@emoji-mart/react': path.resolve(__dirname, 'node_modules/@emoji-mart/react')
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'emoji-mart': ['@emoji-mart/data', '@emoji-mart/react', 'emoji-mart'],
          'three': ['three']
        }
      },
      external: []
    }
  },
  optimizeDeps: {
    include: ['three', '@emoji-mart/data', '@emoji-mart/react', 'emoji-mart']
  },
  server: {
    port: 8080,
  },
});
