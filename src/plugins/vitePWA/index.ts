import { useRegisterSW } from 'virtual:pwa-register/vue';
import type { App } from 'vue';

const vitePWA = {
	install(app: App) {
		useRegisterSW({ immediate: true });
	}
};

export default vitePWA;
