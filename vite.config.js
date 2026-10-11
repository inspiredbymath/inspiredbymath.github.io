import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        montyHall: resolve(__dirname, 'monty-hall.html'),
        prisonersDilemma: resolve(__dirname, 'prisoners-dilemma.html'),
        staircase: resolve(__dirname, 'staircase.html'),
        // Journal is hidden: blog.html / post.html are kept in the repo but
        // left out of the build. Re-add these two lines to bring it back.
        // blog: resolve(__dirname, 'blog.html'),
        // post: resolve(__dirname, 'post.html'),
        simulations: resolve(__dirname, 'simulations.html'),
      },
    },
  },
})
