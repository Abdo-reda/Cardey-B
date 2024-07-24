import type { ColorsEnum } from '../../../enums/colorsEnum';

export interface ITeam {
	id: string;
	score: number;
	color: ColorsEnum;
	players: string[];
}
