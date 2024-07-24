import type { Ref } from 'vue';
import type { IClientService } from '../../client/webRTC/clientServiceInterface';
import type { IGameSettings } from '../entities/gameSettingsInterface';
import type { IHostService } from '../../host/webRTC/hostServiceInterface';
import type { IGameState } from '../entities/gameStateInterface';
import type { IPlayer } from '../entities/playerInterface';

export interface IGameService {
	hostService: IHostService;
	clientService: IClientService;
	gameState: Ref<IGameState>;

	createGameAsync: (gameSettings: IGameSettings) => void;
	getSettings: () => IGameSettings;
	joinTeam: (teamId: string) => void;
	getPlayer: (playerId: string) => IPlayer;
}
