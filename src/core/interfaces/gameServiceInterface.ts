import type { IGameSettings } from './gameSettingsInterface';

export interface IGameService {
	CreateGameAsync: (gameSettings: IGameSettings) => void;
}
