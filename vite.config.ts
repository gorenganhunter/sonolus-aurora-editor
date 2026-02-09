import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import tailwind from 'tailwindcss'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        postcss: {
            plugins: [tailwind(), autoprefixer()],
        },
    },
    plugins: [vue(), VitePWA({
        manifest: {
            "name": "Sonolus Aurora Editor",
            "short_name": "Ædit",
            "icons": [
                {
                    "src": "/pwa-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "any"
                },
                {
                    "src": "/pwa-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "any"
                },
                {
                    "src": "/pwa-maskable-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png",
                    "purpose": "maskable"
                },
                {
                    "src": "/pwa-maskable-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png",
                    "purpose": "maskable"
                }
            ],
            "start_url": "/",
            "display": "standalone",
            "background_color": "#6666ff",
            "theme_color": "#77EFDC",
            "description": "Editor for Sonolus Aurora"
        },
        registerType: "autoUpdate",
        workbox: { globPatterns: ["**/*"] }
    })]
})
