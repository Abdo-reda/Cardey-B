import type { Reactive, Ref } from 'vue';
import type { IGameSettings } from './gameSettingsInterface';
import type { IGameState } from './gameStateInterface';
import type { IPlayer } from './playerInterface';

export interface IGameService {
	gameState: Ref<IGameState>;

	joinGameAsync: () => void;
	joinTeam: (teamId: string) => void;
	startGame: () => void;
	updateWords: (reset: boolean, words: string[]) => void;
	getSettings: () => IGameSettings;
	setPlayerService: (player: IPlayer) => void;
	getCurrentPlayer: () => Reactive<IPlayer>;
	getPlayer: (playerId: string) => IPlayer;
}
