import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { getProtectedJobs, getUserSavedAndAppliedJobs } from './server/jobsHandler.js'
import { handleRegisterUser, handleLoginUser } from './server/authHandlers.js'
import { handleParseResume } from './server/resumeParserHandler.js'
import { handleSyncJobs } from './server/autoJobAdder.js'

function devApiPlugin(env: Record<string, string>) {
  return {
    name: 'dev-api',
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url?.split('?')[0]
        if (
          url === '/api/jobs' ||
          url === '/api/user-jobs' ||
          url === '/api/register' ||
          url === '/api/login' ||
          url === '/api/parse-resume' ||
          url === '/api/sync-jobs' ||
          url === '/api/cron'
        ) {
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
              if (url === '/api/jobs') {
                await getProtectedJobs(req, res)
              } else if (url === '/api/user-jobs') {
                await getUserSavedAndAppliedJobs(req, res)
              } else if (url === '/api/register') {
                await handleRegisterUser(req, res)
              } else if (url === '/api/login') {
                await handleLoginUser(req, res)
              } else if (url === '/api/parse-resume') {
                await handleParseResume(req, res)
              } else if (url === '/api/sync-jobs' || url === '/api/cron') {
                await handleSyncJobs(req, res)
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
    plugins: [react(), devApiPlugin(env)],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
