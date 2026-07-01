import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
 
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Control de Activos AudioLab',
        short_name: 'Activos AudioLab',
        description: 'Gestión de activos y almacenes - AudioLab',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/pwa/icon-64.png', sizes: '64x64', type: 'image/png' },
          { src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Cachea el "shell" de la app (HTML/JS/CSS) para que abra al instante.
        // Las llamadas a la API de activos NO se cachean: siempre van a la red,
        // porque necesitamos datos frescos del inventario.
        navigateFallbackDenylist: [/^\/assets\//, /^\/technical-states\//],
      },
    }),
  ],
})