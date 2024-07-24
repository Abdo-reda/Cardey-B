import type { IGameSettings } from '../interfaces/gameSettingsInterface';
import type { IGameState } from '../interfaces/gameStateInterface';
import type { IPlayer } from '../interfaces/playerInterface';
import type { ITeam } from '../interfaces/teamInterface';

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
