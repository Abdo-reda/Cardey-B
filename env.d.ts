/// <reference types="vite/client" />
/// <reference types="vite-svg-loader" />
/// <reference types="vite-plugin-pwa/vue" />

interface ImportMetaEnv {
	readonly VITE_FIREBASE_API_KEY: string;
	readonly VITE_FIREBASE_API_ID: string;
}

declare const __APP_VERSION__: string

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
