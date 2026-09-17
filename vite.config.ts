import { existsSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

const ICON_DIR = fileURLToPath(new URL('./node_modules/lucide-react/dist/esm/icons/', import.meta.url))

/** Dev server only: `import { Bell } from 'lucide-react'` drags the whole ~5 MB icon barrel through
 *  the dev server on every cold open. Point each name at its own icon module instead (a name without
 *  a file falls back to the barrel). The production build tree-shakes the barrel already. */
function lucidePerIcon(): Plugin {
  const kebab = (name: string) =>
    name
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Za-z])([0-9])/g, '$1-$2')
      .toLowerCase()
  return {
    name: 'tkgd:lucide-per-icon',
    apply: 'serve',
    enforce: 'pre',
    transform(code, id) {
      if (!/\.tsx?$/.test(id) || id.includes('node_modules') || !code.includes("from 'lucide-react'")) return null
      return code.replace(/import\s*\{([^}]*)\}\s*from\s*'lucide-react'/g, (statement, list: string) => {
        const types: string[] = []
        const values: string[] = []
        const barrel: string[] = []
        for (const raw of list.split(',')) {
          const spec = raw.trim()
          if (!spec) continue
          if (spec.startsWith('type ')) {
            types.push(spec.slice(5))
            continue
          }
          const [name, alias = name] = spec.split(/\s+as\s+/)
          const file = `${kebab(name)}.mjs`
          if (existsSync(ICON_DIR + file)) values.push(`import ${alias} from 'lucide-react/dist/esm/icons/${file}'`)
          else barrel.push(spec)
        }
        if (!values.length) return statement
        if (barrel.length) values.push(`import { ${barrel.join(', ')} } from 'lucide-react'`)
        if (types.length) values.push(`import type { ${types.join(', ')} } from 'lucide-react'`)
        return values.join('; ') // one line in, one line out: dev sourcemaps stay on the right line
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [lucidePerIcon(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/motion')) return 'motion'
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'vendor'
          return undefined
        },
      },
    },
  },
})
