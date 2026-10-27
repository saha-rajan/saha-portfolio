import { defineConfig, loadEnv, type Plugin } from 'vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Plugin to resolve figma:asset/* imports to src/assets/*
function figmaAssetPlugin(): Plugin {
  return {
    name: 'figma-asset-resolver',
    resolveId(source: string) {
      if (source.startsWith('figma:asset/')) {
        const assetName = source.replace('figma:asset/', '')
        return path.resolve(__dirname, './src/assets', assetName)
      }
      return null
    },
  }
}

// Dev only: run the Vercel functions in api/ inside the Vite server, so /api/* works
// with plain `npm run dev` (Vercel runs them itself in production)
function localApiPlugin(): Plugin {
  return {
    name: 'local-vercel-api',
    apply: 'serve',
    configureServer(server) {
      // Server-side keys like GEMINI_API_KEY (no VITE_ prefix) from .env.local
      Object.assign(process.env, loadEnv(server.config.mode, __dirname, ''))

      server.middlewares.use('/api', async (req, res) => {
        const name = (req.url || '').split('?')[0].replace(/^\/+|\/+$/g, '')
        const file = path.resolve(__dirname, 'api', `${name}.ts`)
        if (!name || !fs.existsSync(file)) {
          res.statusCode = 404
          res.end(JSON.stringify({ error: `No API route /api/${name}` }))
          return
        }

        let raw = ''
        for await (const chunk of req) raw += chunk
        let body: unknown = raw
        try { body = raw ? JSON.parse(raw) : {} } catch {}

        const vercelRes = {
          status(code: number) { res.statusCode = code; return vercelRes },
          json(data: unknown) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(data))
            return vercelRes
          },
        }

        try {
          const mod = await server.ssrLoadModule(file)
          await mod.default(Object.assign(req, { body }), vercelRes)
        } catch (err: any) {
          server.config.logger.error(`[api/${name}] ${err?.stack || err}`)
          if (!res.writableEnded) vercelRes.status(500).json({ error: err?.message || 'API error' })
        }
      })
    },
  }
}

export default defineConfig({
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  plugins: [
    localApiPlugin(),
    // Plugin to resolve Figma Make asset imports
    figmaAssetPlugin(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
