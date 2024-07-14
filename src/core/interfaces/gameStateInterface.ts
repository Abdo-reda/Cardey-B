import type { IGameSettings } from './gameSettingsInterface';
import type { ITeam } from './teamInterface';

export interface IGameState {
	teams: ITeam[];
	gameSettings: IGameSettings;
}
