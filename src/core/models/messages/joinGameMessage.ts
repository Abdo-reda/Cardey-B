import { MethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import type { IPlayer } from '@/core/interfaces/playerInterface';

export class JoinGameMessage extends BaseMessage<IPlayer> {
	constructor(senderId: string, data: IPlayer) {
		super(MethodsEnum.JOIN_GAME, senderId, data);
	}
}
