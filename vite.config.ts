import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    proxy: {
      '/chaussec': {
        target: 'http://chaussec-api:5050',
        changeOrigin: true,
      },
      '/docker': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
      '/requin': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
      '/opensearch': {
        target: 'http://localhost:9200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/opensearch/, ''),
      },
    },
  },
})
