import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { createOrder, verifyPayment, verifyPassStatus } from './server/razorpayHandlers.js'
import { getProtectedJobs, getUserSavedAndAppliedJobs } from './server/jobsHandler.js'
import { handleRegisterUser } from './server/authHandlers.js'

function razorpayDevApiPlugin(env: Record<string, string>) {
  return {
    name: 'razorpay-dev-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url?.split('?')[0]
        if (
          url === '/api/create-order' ||
          url === '/api/verify-payment' ||
          url === '/api/verify-pass' ||
          url === '/api/jobs' ||
          url === '/api/user-jobs' ||
          url === '/api/register'
        ) {
          // Ensure environment variables are populated in process.env
          process.env.RAZORPAY_KEY_ID =
            env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || env.VITE_RAZORPAY_KEY_ID
          process.env.RAZORPAY_KEY_SECRET =
            env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET
          process.env.SUPABASE_URL =
            env.SUPABASE_URL || process.env.SUPABASE_URL || env.VITE_SUPABASE_URL
          process.env.SUPABASE_ANON_KEY =
            env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY
          process.env.SUPABASE_SERVICE_ROLE_KEY =
            env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

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
              } else if (url === '/api/verify-pass') {
                await verifyPassStatus(req, res)
              } else if (url === '/api/jobs') {
                await getProtectedJobs(req, res)
              } else if (url === '/api/user-jobs') {
                await getUserSavedAndAppliedJobs(req, res)
              } else if (url === '/api/register') {
                await handleRegisterUser(req, res)
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
