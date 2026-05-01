import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/fish/v1/tts': {
          target: 'https://api.fish.audio',
          changeOrigin: true,
          rewrite: (path) => {
            const query = path.includes('?') ? path.slice(path.indexOf('?')) : ''
            return '/v1/tts' + query
          },
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.FISH_AUDIO_API_KEY) {
                proxyReq.setHeader('Authorization', `Bearer ${env.FISH_AUDIO_API_KEY}`)
              }
            })
          }
        },
        '/api/fish/model': {
          target: 'https://api.fish.audio',
          changeOrigin: true,
          rewrite: (path) => {
            const query = path.includes('?') ? path.slice(path.indexOf('?')) : ''
            return '/model' + query
          },
        },
        '/api/fish/audio': {
          target: 'https://platform.r2.fish.audio',
          changeOrigin: true,
          rewrite: (path) => {
            const qIdx = path.indexOf('?')
            if (qIdx < 0) return '/'
            const params = new URLSearchParams(path.slice(qIdx))
            const audioUrl = params.get('url')
            if (!audioUrl) return '/'
            try {
              return new URL(audioUrl).pathname
            } catch {
              return '/'
            }
          },
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
