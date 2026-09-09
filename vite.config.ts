import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, cpSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-static-extras',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist')
        // SPA fallback for non-Vercel static hosts
        copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
        // Marketing site
        const landingSrc = resolve(__dirname, 'landing')
        if (existsSync(landingSrc)) {
          cpSync(landingSrc, resolve(outDir, 'landing'), { recursive: true })
        }
      },
    },
  ],
})
