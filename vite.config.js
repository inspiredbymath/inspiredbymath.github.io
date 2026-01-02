import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/mathfun/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        montyHall: resolve(__dirname, 'monty-hall.html'),
        prisonersDilemma: resolve(__dirname, 'prisoners-dilemma.html'),
        staircase: resolve(__dirname, 'staircase.html'),
        blog: resolve(__dirname, 'blog.html'),
        post: resolve(__dirname, 'post.html'),
      },
    },
  },
})
