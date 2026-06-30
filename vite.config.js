import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// En Vercel el sitio se sirve desde la raíz, por eso `base` es '/'.
// (En GitHub Pages era '/paicio/' porque iba en un subdirectorio.)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/',
})
