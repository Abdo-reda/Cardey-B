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
			injectRegister: 'auto',
			registerType: 'autoUpdate',
			strategies: 'generateSW',
			devOptions: {
				enabled: true
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,ttf}']
			},
			manifest: {
				name: 'Cardy-B',
				short_name: 'Cardy-B',
				start_url: '/?mode=standalone',
				display: 'standalone',
				background_color: '#FFFFFF',
				theme_color: '#1677ff',
				description: 'Online Party Card Games!',
				icons: [
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable'
					},
					{
						src: '/pwa-maskable-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				],
				screenshots: [
					{
						src: '/mobile_screenshot_1.png',
						sizes: '1170x2604',
						type: 'image/png',
						form_factor: 'narrow',
						label: 'Mobile Home Screen Light'
					},
					{
						src: '/mobile_screenshot_2.png',
						sizes: '1170x2604',
						type: 'image/png',
						form_factor: 'narrow',
						label: 'Mobile Home Screen Dark'
					},
					{
						src: '/desktop_screenshot_1.png',
						sizes: '2560x1440',
						type: 'image/png',
						form_factor: 'wide',
						label: 'Desktop Home Screen Dark'
					},
					{
						src: '/desktop_screenshot_2.png',
						sizes: '2560x1440',
						type: 'image/png',
						form_factor: 'wide',
						label: 'Desktop Home Screen Dark'
					}
				]
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
	define: {
        '__APP_VERSION__': JSON.stringify(process.env.npm_package_version),
    },
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
});
