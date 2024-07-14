import { ClientServiceKey, GameServiceKey, HostServiceKey } from '@/core/constants/injectionKeys';
import { ClientService } from '@/core/services/clientService';
import { GameService } from '@/core/services/gameService';
import { HostService } from '@/core/services/hostService';
import type { App } from 'vue';

const webRTC = {
	install(app: App) {
		const hostService = new HostService();
		const clientService = new ClientService();
		const gameService = new GameService(hostService, clientService);
		app.provide(HostServiceKey, hostService);
		app.provide(ClientServiceKey, clientService);
		app.provide(GameServiceKey, gameService);
	}
};

export default webRTC;
