import { defineConfig, loadEnv } from 'vite'

function withJsonHelpers(res: any) {
  if (!res.status) {
    res.status = (code: number) => {
      res.statusCode = code
      return res
    }
  }
  if (!res.json) {
    res.json = (payload: unknown) => {
      if (!res.getHeader('Content-Type')) {
        res.setHeader('Content-Type', 'application/json')
      }
      res.end(JSON.stringify(payload))
      return res
    }
  }
  return res
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.MONGODB_URI && !process.env.MONGODB_URI) {
    process.env.MONGODB_URI = env.MONGODB_URI
  }

  let handlerPromise: Promise<{ default: (req: any, res: any) => Promise<void> }> | null = null

  const plugins = command === 'serve'
    ? [
        {
          name: 'local-vercel-api',
          configureServer(server: any) {
            server.middlewares.use('/api/leads', async (req: any, res: any, next: any) => {
              if (req.method !== 'POST') {
                res.statusCode = 405
                res.setHeader('Allow', 'POST')
                return withJsonHelpers(res).json({ error: 'METHOD_NOT_ALLOWED' })
              }

              let body = ''
              req.on('data', (chunk: Buffer) => {
                body += chunk.toString()
              })
              req.on('end', async () => {
                req.body = body
                try {
                  if (!handlerPromise) {
                    handlerPromise = import('./api/leads.js')
                  }
                  const { default: handler } = await handlerPromise
                  await handler(req, withJsonHelpers(res))
                } catch (error) {
                  console.error('Local /api/leads error', error)
                  if (!res.writableEnded) {
                    withJsonHelpers(res).status(500).json({ error: 'INTERNAL_ERROR' })
                  }
                }
              })
            })
          },
        },
      ]
    : []

  return {
    assetsInclude: ['**/*.html'],
    plugins,
  }
})
