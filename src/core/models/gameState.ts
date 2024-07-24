import type { IGameSettings } from '../interfaces/game/entities/gameSettingsInterface';
import type { IGameState } from '../interfaces/game/entities/gameStateInterface';
import type { IPlayer } from '../interfaces/game/entities/playerInterface';
import type { ITeam } from '../interfaces/game/entities/teamInterface';

export class GameState implements IGameState {
	teams: ITeam[] = [];
	players: IPlayer[] = [];
	gameSettings: IGameSettings = {
		numberOfPlayers: 5,
		numberOfTeams: 3,
		timePerRound: 60,
		wordsPerPlayer: 5
	};
}
