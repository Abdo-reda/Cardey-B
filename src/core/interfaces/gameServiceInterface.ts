import type { Reactive } from 'vue';
import type { IClientService } from './clientServiceInterface';
import type { IGameSettings } from './gameSettingsInterface';
import type { IHostService } from './hostServiceInterface';
import type { IGameState } from './gameStateInterface';

export interface IGameService {
	hostService: IHostService;
	clientService: IClientService;
	gameState: Reactive<IGameState>;

	createGameAsync: (gameSettings: IGameSettings) => void;
	getSettings: () => IGameSettings;
}
