import { GameServiceKey } from '@/core/constants/injectionKeys';
import { GameService } from '@/core/services/gameService';
import type { App } from 'vue';
import registerMessages from './registerMessages';

const webRTC = {
	install(app: App) {
		const gameService = new GameService();
		registerMessages();
		app.provide(GameServiceKey, gameService);
	}
};

export default webRTC;
