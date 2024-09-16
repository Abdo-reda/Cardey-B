import { GamePhasesEnum } from '../enums/gamePhasesEnum';
import { RoutesEnum } from '../enums/routesEnum';
import type { IGameSettings } from '../interfaces/gameSettingsInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import type { ITeam } from '../interfaces/teamInterface';

export class GameState implements IGameState {
	teams: ITeam[] = [];
	players: IPlayer[] = [];
	isPaused = false;
	turns: {
		playersOrder: string[];
		currentPlayerIndex: number;
		newTurn: boolean;
	} = {
		playersOrder: [],
		currentPlayerIndex: -1,
		newTurn: true
	};
	words: {
		remaining: string[];
		skipped: string[];
		scored: string[];
	} = {
		remaining: [],
		skipped: [],
		scored: []
	};
	currentRoute: RoutesEnum = RoutesEnum.HOME;
	gamePhase = {
		index: 0,
		phase: GamePhasesEnum.NONE,
		description: ''
	};
	gameSettings: IGameSettings = {
		numberOfPlayers: 5,
		numberOfTeams: 3,
		timePerRound: 60,
		wordsPerPlayer: 5
	};
}
