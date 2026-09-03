import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  const API_BASE_URL = env.VITE_API_BASE_URL || 'http://localhost:8000'
  const PORT = env.VITE_PORT || 3002

  return {
    plugins: [react(), tailwindcss()],
    base: '/frontend/', 
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.webp'],
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(API_BASE_URL),
      'import.meta.env.VITE_APP_NAME': JSON.stringify(env.VITE_APP_NAME || 'EventSphere')
    },
    server: {
      port: parseInt(PORT, 10),
      proxy: {
        '/api': {
          target: API_BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/storage': {  
          target: API_BASE_URL,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
