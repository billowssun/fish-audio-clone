import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function fishAudioDevProxy() {
  return {
    name: 'fish-audio-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/fish/audio', async (req, res) => {
        try {
          const requestUrl = new URL(req.url || '', 'http://localhost')
          const targetUrl = requestUrl.searchParams.get('url')

          if (!targetUrl) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Missing url parameter' }))
            return
          }

          const parsedTarget = new URL(targetUrl)
          const isFishAudioHost = parsedTarget.hostname === 'fish.audio' || parsedTarget.hostname.endsWith('.fish.audio')

          if (parsedTarget.protocol !== 'https:' || !isFishAudioHost) {
            res.statusCode = 403
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Forbidden host' }))
            return
          }

          const response = await fetch(targetUrl)
          res.statusCode = response.status
          res.setHeader('Content-Type', response.headers.get('Content-Type') || 'audio/mpeg')
          res.setHeader('Cache-Control', 'public, max-age=86400')

          const body = Buffer.from(await response.arrayBuffer())
          res.end(body)
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [fishAudioDevProxy(), react()],
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
