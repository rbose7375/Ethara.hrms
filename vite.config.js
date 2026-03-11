import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'

const jsxSourcePattern = /[/\\]src[/\\].*\.js$/

export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        // Support both Windows and POSIX path separators for source files.
        if (!jsxSourcePattern.test(id)) {
          return null
        }

        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
    react(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
