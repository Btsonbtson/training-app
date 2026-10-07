import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

function remindApiPlugin() {
  return {
    name: 'remind-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = req.url?.split('?')[0]
        if (path !== '/api/remind') {
          next()
          return
        }
        const mod = await server.ssrLoadModule('/api/remind.js')
        return mod.default(req, res)
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] == null) process.env[key] = value
  }

  return {
    plugins: [react(), remindApiPlugin()],
    server: {
      host: true,
      port: 5173,
    },
  }
})
