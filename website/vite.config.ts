import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api/cinema-city': {
        target: 'https://www.cinema-city.pl/pl/data-api-service/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cinema-city/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Drop upstream cookies in dev proxy to avoid browser "invalid domain" warnings.
            delete proxyRes.headers['set-cookie']
          })
        },
      }
    }
  }
})
