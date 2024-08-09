import type { GamePhasesEnum } from '../enums/gamePhasesEnum';
import type { RoutesEnum } from '../enums/routesEnum';
import type { IGameSettings } from './gameSettingsInterface';
import type { IPlayer } from './playerInterface';
import type { ITeam } from './teamInterface';

export interface IGameState {
	teams: ITeam[];
	players: IPlayer[];
	words: {
		remaining: string[];
		skipped: string[];
		done: string[];
	};
	gamePhase: {
		phase: GamePhasesEnum;
		description: string;
	};
	currentRoute: RoutesEnum;
	gameSettings: IGameSettings;
}
