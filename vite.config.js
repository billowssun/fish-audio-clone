import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/fish': {
          target: 'https://api.fish.audio',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/fish/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.FISH_AUDIO_API_KEY) {
                proxyReq.setHeader('Authorization', `Bearer ${env.FISH_AUDIO_API_KEY}`)
              }
            })
          }
        },
        '/api/aliyun/asr': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          rewrite: () => '/openai/v1/audio/transcriptions',
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.GROQ_API_KEY) {
                proxyReq.setHeader('Authorization', `Bearer ${env.GROQ_API_KEY}`)
              }
            })
          }
        }
      }
    }
  }
})
