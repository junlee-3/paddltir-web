import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  base: '/app/',
  plugins: [
    react(),
    {
      name: 'copy-app-into-website',
      closeBundle() {
        const outDir = resolve(__dirname, 'dist')
        const dest = resolve(__dirname, 'website/public/app')
        if (!existsSync(outDir)) return
        mkdirSync(resolve(__dirname, 'website/public'), { recursive: true })
        rmSync(dest, { recursive: true, force: true })
        cpSync(outDir, dest, { recursive: true })
      },
    },
  ],
})
