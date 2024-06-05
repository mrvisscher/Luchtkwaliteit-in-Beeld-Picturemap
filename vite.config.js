import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";

console.log(resolve(__dirname, 'index.html'))

export default defineConfig({
  root: 'src',
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/))  return null

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
        })
      },
    },
    react(),
  ],

  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, './src/index.html'),
        nvo: resolve(__dirname, './src/nvo.html'),
        suggest: resolve(__dirname, './src/suggest.html'),
        onsbuiten: resolve(__dirname, './src/onsbuiten.html'),
        kennisfestival: resolve(__dirname, './src/kennisfestival.html'),
      },
    },
    outDir: '../dist'
  },
})
