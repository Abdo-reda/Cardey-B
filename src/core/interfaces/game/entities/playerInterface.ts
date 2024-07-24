import type { AvatarsEnum } from '../../../enums/avatarsEnum';

export interface IPlayer {
	id: string;
	name: string;
	avatar: AvatarsEnum;
	isHost: boolean;
	roomId: string;
	teamId: string;
}
