export default {
  build: {
    sourcemap: true,
  },
  server: {
    proxy: {
      '/api-rest': {
        target: 'http://localhost', 
        changeOrigin: true,
      },
    },
  }
}
