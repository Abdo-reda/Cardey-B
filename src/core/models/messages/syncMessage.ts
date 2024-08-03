import { MethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import type { IGameState } from '@/core/interfaces/gameStateInterface';

export class SyncMessage extends BaseMessage<IGameState> {
	constructor(senderId: string, data: IGameState) {
		super(MethodsEnum.SYNC, senderId, data);
	}
}
