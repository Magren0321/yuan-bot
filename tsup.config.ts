import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  sourcemap: true,
  minifySyntax: true,
  splitting: false,
  outDir: 'dist',
  platform: 'node',
  format: ['cjs', 'esm'],
  define: {
    IS_NODE: 'true'
  }
})
