import type { ColorsEnum } from '../enums/colorsEnum';
import type { IPlayer } from './playerInterface';

export interface ITeam {
	id: string;
	score: number;
	color: ColorsEnum;
	players: IPlayer[];
}
