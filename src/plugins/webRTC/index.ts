import {
	ClientServiceKey,
	GameServiceKey,
	HostServiceKey,
	PlayerServiceKey
} from '@/core/constants/injectionKeys';
import { ClientService } from '@/core/services/clientService';
import { GameService } from '@/core/services/gameService';
import { HostService } from '@/core/services/hostService';
import { PlayerService } from '@/core/services/playerService';
import type { App } from 'vue';

const webRTC = {
	install(app: App) {
		const hostService = new HostService();
		const clientService = new ClientService();
		const playerService = new PlayerService(hostService, clientService);
		const gameService = new GameService(hostService, clientService, playerService);
		app.provide(HostServiceKey, hostService);
		app.provide(ClientServiceKey, clientService);
		app.provide(GameServiceKey, gameService);
		app.provide(PlayerServiceKey, playerService);
	}
};

export default webRTC;
