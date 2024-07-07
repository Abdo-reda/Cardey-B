import type { AvatarsEnum } from '../enums/avatarsEnum';

export interface IPlayer {
	id: number;
	name: string;
	avatar: AvatarsEnum;
}
