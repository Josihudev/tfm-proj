import { defineConfig } from 'vite';
export default defineConfig({
  root: '.', // Arrel del projecte
  publicDir: 'public', // Recursos estàtics
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {      // API de posicions
      '/api-rest': {
        target: 'http://localhost', 
        changeOrigin: true,
      },
    },
  }
  
});
