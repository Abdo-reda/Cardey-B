import {
	ClientPlayerServiceKey,
	ClientServiceKey,
	GameServiceKey,
	HostPlayerServiceKey,
	HostServiceKey,
} from '@/core/constants/injectionKeys';
import { ClientService } from '@/core/services/clientService';
import { GameService } from '@/core/services/gameService';
import { HostService } from '@/core/services/hostService';
import { ClientPlayerService } from '@/core/services/clientPlayerService';
import type { App } from 'vue';
import { HostPlayerService } from '@/core/services/hostPlayerService';

const webRTC = {
	install(app: App) {
		// const hostService = new HostService();
		// const clientService = new ClientService();
		// const hostPlayerService = new HostPlayerService(hostService);
		// const clientPlayerService = new ClientPlayerService(clientService);
		const gameService = new GameService();
		// app.provide(HostServiceKey, hostService);
		// app.provide(ClientServiceKey, clientService);
		app.provide(GameServiceKey, gameService);
		// app.provide(ClientPlayerServiceKey, clientPlayerService);
		// app.provide(HostPlayerServiceKey, hostPlayerService);

	}
};

export default webRTC;
