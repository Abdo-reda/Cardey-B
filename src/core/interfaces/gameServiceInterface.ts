import type { Ref } from 'vue';
import type { IClientService } from './clientServiceInterface';
import type { IGameSettings } from './gameSettingsInterface';
import type { IHostService } from './hostServiceInterface';
import type { IGameState } from './gameStateInterface';
import type { IPlayer } from './playerInterface';

export interface IGameService {
	hostService: IHostService;
	clientService: IClientService;
	gameState: Ref<IGameState>;

	createGameAsync: (gameSettings: IGameSettings) => void;
	getSettings: () => IGameSettings;
	joinTeam: (teamId: string) => void;
	getPlayer: (playerId: string) => IPlayer;
}
