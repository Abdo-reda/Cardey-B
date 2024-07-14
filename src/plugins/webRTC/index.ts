import { ClientServiceKey, HostServiceKey } from '@/core/constants/injectionKeys';
import { ClientService } from '@/core/services/clientService';
import { HostService } from '@/core/services/hostService';
import type { App } from 'vue';

const webRTC = {
	install(app: App) {
		app.provide(HostServiceKey, new HostService());
		app.provide(ClientServiceKey, new ClientService());
	}
};

export default webRTC;
