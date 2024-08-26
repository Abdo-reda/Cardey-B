import { AvatarsList } from '../enums/avatarsEnum';
import type { IPlayer } from '../interfaces/playerInterface';

export class Player implements IPlayer {
	id = '';
	name = '';
	avatar = AvatarsList[Math.floor(Math.random() * AvatarsList.length)];
	isHost = false;
	roomId = '';
	teamId = '';
	words = [];
}
