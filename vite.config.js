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
        simulations: resolve(__dirname, 'simulations.html'),
        // The Journal is hidden. blog.html / post.html / blog.js / post.js and
        // posts/*.md all stay in the repo — uncomment these two lines to bring
        // the section back, and restore its links in each page's <nav>.
        // blog: resolve(__dirname, 'blog.html'),
        // post: resolve(__dirname, 'post.html'),
      },
    },
  },
})
