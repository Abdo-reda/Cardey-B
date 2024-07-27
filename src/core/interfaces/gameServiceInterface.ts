import type { Reactive, Ref } from 'vue';
import type { IGameSettings } from './gameSettingsInterface';
import type { IGameState } from './gameStateInterface';
import type { IPlayer } from './playerInterface';

export interface IGameService {
	gameState: Ref<IGameState>;

	joinGameAsync: () => void;
	getSettings: () => IGameSettings;
	setPlayerService: (player: IPlayer) => void;
	joinTeam: (teamId: string) => void;
	getCurrentPlayer: () => Reactive<IPlayer>;
	getPlayer: (playerId: string) => IPlayer;
}
