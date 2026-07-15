import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 4173,
    proxy: {
      '/chaussec': {
        target: 'http://localhost:5050/chaussec',
        changeOrigin: true,
      },
      '/docker': {
        target: 'http://localhost:5050/docker',
        changeOrigin: true,
      },
      '/requin': {
        target: 'http://localhost:5050/requin',
        changeOrigin: true,
      },
      '/opensearch': {
        target: 'http://localhost:9200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/opensearch/, ''),
      },
      '/grafana': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
