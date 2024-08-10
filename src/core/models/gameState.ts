import { GAME_PHASES_DESCRIPTIONS, GamePhasesEnum } from '../enums/gamePhasesEnum';
import { RoutesEnum } from '../enums/routesEnum';
import type { IGameSettings } from '../interfaces/gameSettingsInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import type { ITeam } from '../interfaces/teamInterface';

export class GameState implements IGameState {
	teams: ITeam[] = [];
	players: IPlayer[] = [];
	turns = {
		playersOrder: [],
		currentPlayerIndex: 0
	};
	words = {
		remaining: [],
		skipped: [],
		scored: []
	};
	currentRoute: RoutesEnum = RoutesEnum.LOBBY;
	gamePhase = {
		phase: GamePhasesEnum.PHASE_ONE,
		description: GAME_PHASES_DESCRIPTIONS.get(GamePhasesEnum.PHASE_ONE)!
	};
	gameSettings: IGameSettings = {
		numberOfPlayers: 5,
		numberOfTeams: 3,
		timePerRound: 60,
		wordsPerPlayer: 5
	};
}
