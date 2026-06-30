import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base` se ajusta al nombre del repositorio en GitHub Pages.
// Si el repo se llama diferente, cambiar '/paicio/' por '/nombre-del-repo/'.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/paicio/',
})
