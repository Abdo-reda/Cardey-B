import type { IGameSettings } from './gameSettingsInterface';
import type { IPlayer } from './playerInterface';
import type { ITeam } from './teamInterface';

export interface IGameState {
	teams: ITeam[];
	players: IPlayer[];
	gameSettings: IGameSettings;
}
