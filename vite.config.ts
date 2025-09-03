import { type ManifestOptions, VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

const manifest: Partial<ManifestOptions> | false = {
  id: '/',
  start_url: '/',
  scope: '/',
  theme_color: '#333333',
  background_color: '#737373',
  icons: [{
    purpose: 'maskable',
    sizes: '512x512',
    src: 'icon512_maskable.png',
    type: 'image/png',
  }, { purpose: 'any', sizes: '512x512', src: 'icon512_rounded.png', type: 'image/png' }],
  orientation: 'any',
  display: 'standalone',
  lang: 'en-US',
  name: '2048 game App',
  short_name: '2048',
  description: '2048 puzzle as installable PWA',
};

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{html,css,js,mjs,ico,png,svg}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/backoffice/],
      },
      manifest: manifest,
    }),
  ],
});

