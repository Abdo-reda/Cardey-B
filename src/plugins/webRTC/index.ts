import { HostServiceKey } from '@/core/constants/injectionKeys';
import { HostService } from '@/core/services/hostService';
import type { App } from 'vue';

const webRTC = {
	install(app: App) {
		app.provide(HostServiceKey, new HostService());
	}
};

export default webRTC;
