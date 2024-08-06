import {
	GameServiceKey,
} from '@/core/constants/injectionKeys';
import { GameService } from '@/core/services/gameService';
import type { App } from 'vue';

const webRTC = {
	install(app: App) {
		const gameService = new GameService();
		app.provide(GameServiceKey, gameService);
	}
};

export default webRTC;
