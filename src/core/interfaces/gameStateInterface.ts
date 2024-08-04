import type { GamePhasesEnum } from '../enums/gamePhasesEnum';
import type { RoutesEnum } from '../enums/routesEnum';
import type { IGameSettings } from './gameSettingsInterface';
import type { IPlayer } from './playerInterface';
import type { ITeam } from './teamInterface';

export interface IGameState {
	teams: ITeam[];
	players: IPlayer[];
	gamePhase: {
		phase: GamePhasesEnum;
		description: string;
	};
	currentRoute: RoutesEnum;
	gameSettings: IGameSettings;
}
