import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import svgLoader from 'vite-svg-loader';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		VitePWA({
			registerType: 'autoUpdate',
			devOptions: {
				enabled: true
			}
		}),
		svgLoader({
			defaultImport: 'component'
		}),
		Components({
			resolvers: [
				AntDesignVueResolver({
					importStyle: false // css in js
				})
			]
		})
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
});

// injectRegister: false,

// pwaAssets: {
//   disabled: false,
//   config: true,
// },

// manifest: {
//   name: 'vue-pwa-vite',
//   short_name: 'vue-pwa-vite',
//   description: 'This is a description for pwa',
//   theme_color: '#1f1f1f',
// },

// workbox: {
//   globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
//   cleanupOutdatedCaches: true,
//   clientsClaim: true,
// },

// devOptions: {
//   enabled: false,
//   navigateFallback: 'index.html',
//   suppressWarnings: true,
//   type: 'module',
// },
