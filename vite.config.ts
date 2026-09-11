import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { createOrder, verifyPayment } from './server/razorpayHandlers.js'

function razorpayDevApiPlugin(env: Record<string, string>) {
  return {
    name: 'razorpay-dev-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url?.split('?')[0]
        if (url === '/api/create-order' || url === '/api/verify-payment') {
          // Ensure environment variables are populated in process.env
          process.env.RAZORPAY_KEY_ID =
            env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || env.VITE_RAZORPAY_KEY_ID
          process.env.RAZORPAY_KEY_SECRET =
            env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET

          let body = ''
          req.on('data', (chunk: any) => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              req.body = body ? JSON.parse(body) : {}
            } catch {
              req.body = {}
            }
            if (!res.status) {
              res.status = (code: number) => {
                res.statusCode = code
                return res
              }
            }
            if (!res.json) {
              res.json = (data: any) => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
              }
            }

            try {
              if (url === '/api/create-order') {
                await createOrder(req, res)
              } else if (url === '/api/verify-payment') {
                await verifyPayment(req, res)
              }
            } catch (err: any) {
              res.status(500).json({ error: err?.message || 'Internal server error' })
            }
          })
          return
        }
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), razorpayDevApiPlugin(env)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
