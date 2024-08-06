import { MethodsEnum } from '@/core/enums/methodsEnum';
import { BaseMessage } from './baseMessage';
import type { IPlayerWords } from '@/core/interfaces/messageInterfaces/playerWordsInterface';

export class PlayerWordsMessage extends BaseMessage<IPlayerWords> {
	constructor(senderId: string, data: IPlayerWords) {
		super(MethodsEnum.UPDATE_WORDS, senderId, data);
	}
}
