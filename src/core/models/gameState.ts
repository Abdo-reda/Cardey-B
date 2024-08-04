import { RoutesEnum } from '../enums/routesEnum';
import type { IGameSettings } from '../interfaces/gameSettingsInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import type { ITeam } from '../interfaces/teamInterface';

export class GameState implements IGameState {
	teams: ITeam[] = [];
	players: IPlayer[] = [];
	// currentRoute: RoutesEnum = RoutesEnum.HOME;
	gameSettings: IGameSettings = {
		numberOfPlayers: 5,
		numberOfTeams: 3,
		timePerRound: 60,
		wordsPerPlayer: 5
	};
}
